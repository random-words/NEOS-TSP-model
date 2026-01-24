/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import type {
  CreateRouteRequest,
  UpdateRouteRequest,
  OptimizeRouteParams,
  GetAllRoutesQuery,
  ObjectIdString,
} from 'node-api-contracts';
import { ROUTE_ANCHORS_CONST } from 'node-api-contracts';

import { RoutesRepository } from 'src/repository/routes.repository';
import { LocationsRepository } from 'src/repository/locations.repository';
import {
  EngineSolveRequest,
  EngineSolveResponse,
} from 'src/shared/contracts/route-optimization.contract';

@Injectable()
export class RoutesService {
  constructor(
    private readonly routesRepository: RoutesRepository,
    private readonly locationsRepository: LocationsRepository,
  ) {}

  async createRoute(dto: CreateRouteRequest) {
    // MVP: якщо клієнт не передав totals — ставимо 0
    const created = await this.routesRepository.create({
      ...dto,
      totalDistance: dto.totalDistance ?? 0,
      totalTime: dto.totalTime ?? 0,
      visitOrder: [],
    });

    return { ok: true, data: created };
  }

  async getAllRoutes(q: GetAllRoutesQuery) {
    const { items, total } = await this.routesRepository.findAll(q);

    return {
      ok: true,
      data: {
        items,
        meta: {
          page: q.page,
          limit: q.limit,
          total,
          hasNext: q.page * q.limit < total,
        },
      },
    };
  }

  async getRouteById(id: ObjectIdString) {
    const route = await this.routesRepository.findById(id);
    if (!route) throw new NotFoundException('Route not found');
    return { ok: true, data: route };
  }

  async updateRoute(id: ObjectIdString, dto: UpdateRouteRequest) {
    const updated = await this.routesRepository.updateById(id, dto);
    if (!updated) throw new NotFoundException('Route not found');
    return { ok: true, data: updated };
  }

  async deleteRoute(id: ObjectIdString) {
    const deleted = await this.routesRepository.deleteById(id);
    if (!deleted) throw new NotFoundException('Route not found');
    return { ok: true, data: { deleted: true } };
  }

  async optimizeRoute(dto: OptimizeRouteParams) {
    const { items: allLocations } = await this.locationsRepository.findAll({
      page: 1,
      limit: 1000,
    });

    // Відфільтрувати та відсортувати локації за вподобаннями користувача
    // Для простоти вибираємо перші locationCount локацій
    const selected = allLocations
      .filter(
        l => dto.winePreferences.includes('ALL') || /* власний фільтр */ true,
      )
      .slice(0, dto.locationCount);

    // Будуємо рядок координат lon,lat;lon,lat;...
    const coords = selected
      .map(l => {
        const [lon, lat] = l.location.coordinates;
        return `${lon},${lat}`;
      })
      .join(';');

    // Запит до OSRM
    const osrmUrl = `http://router.project-osrm.org/table/v1/driving/${coords}?annotations=distance`;
    const osrmResp = await fetch(osrmUrl);
    const osrmJson = await osrmResp.json();

    if (osrmJson.code !== 'Ok' || !Array.isArray(osrmJson.distances)) {
      throw new HttpException('Failed to build distance matrix', 500);
    }
    const matrix: number[][] = osrmJson.distances.map((row: number[]) =>
      row.map(meters =>
        typeof meters === 'number' ? meters / 1000 : Infinity,
      ),
    );

    // Формуємо запит до engine
    const payload: EngineSolveRequest = {
      data_source: 'excel', // engine наразі приймає лише excel/tsplib
      s_value: 1, // індекс старту (може бути 0 чи 1 залежно від engine)
      k_value: selected.length,
      group_size: dto.peopleCount,
      budget_max: dto.budgetPerPerson * dto.peopleCount,
      time_max: dto.timeLimit,
      mode: 'min_distance',
      matrix,
      nodes: selected.map(l => l._id.toString()),
    };

    const engineResp = await fetch('http://engine_api:8000/api/tsp/solve/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const engineJson: EngineSolveResponse = await engineResp.json();

    if (!engineJson.ok || !engineJson.tour) {
      throw new HttpException(
        `Engine error: ${engineJson.error ?? engineJson.solver_status}`,
        500,
      );
    }

    // Перетворюємо індекси у MongoDB‑ID
    const orderedIds = engineJson.tour.map(
      (i: string | number) => payload.nodes[i],
    );

    return { route: orderedIds, metrics: engineJson.metrics };
  }

  async getRouteAnchors() {
    return { ok: true, data: ROUTE_ANCHORS_CONST };
  }
}
