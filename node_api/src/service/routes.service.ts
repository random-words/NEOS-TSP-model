import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  CreateRouteRequest,
  UpdateRouteRequest,
  OptimizeRouteRequest,
  GetAllRoutesQuery,
  ObjectIdString,
} from 'node-api-contracts';
import { ROUTE_ANCHORS_CONST } from 'node-api-contracts';

import { RoutesRepository } from 'src/repository/routes.repository';
import { LocationsRepository } from 'src/repository/locations.repository';

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

  async optimizeRoute(routeId: ObjectIdString, dto: OptimizeRouteRequest) {
    // MVP: поки що тільки валідуємо anchorId, без реального OSRM/матриць
    if (dto.anchorId) {
      const exists = ROUTE_ANCHORS_CONST.some(a => a.id === dto.anchorId);
      if (!exists) throw new NotFoundException('Anchor not found');
    }

    const route = await this.routesRepository.findById(routeId);
    if (!route) throw new NotFoundException('Route not found');

    // Заготовка: зібрати потрібні локації
    // (Якщо хочеш оптимізувати саме locationsMap, достатньо витягнути їх)
    const locations = await this.locationsRepository.findByIds(
      route.locationsMap,
    );

    // TODO (пізніше): OSRM matrix/route + engine API
    // Зараз: повертаємо як є
    return {
      ok: true,
      data: route,
      debug: {
        mode: dto.mode,
        anchorId: dto.anchorId ?? null,
        locationsCount: locations.length,
      },
    };
  }

  async getRouteAnchors() {
    return { ok: true, data: ROUTE_ANCHORS_CONST };
  }
}
