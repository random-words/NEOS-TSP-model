import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { LocationsRepository } from 'src/repository/locations.repository';
import { RoutesRepository } from 'src/repository/routes.repository';

@Injectable()
export class RoutesService {
  constructor(
    private readonly routesRepository: RoutesRepository,
    private readonly locationsRepository: LocationsRepository,
  ) {}

  async optimizeRoute(dto) {
    const openStreetMapUrl = `https://router.project-osrm.org/route/v1/driving/LNG,LAT;LNG,LAT?overview=full&geometries=geojson`;

    // STEPS
    // Aggregate all locations
    const aggregatedLocations = await this.locationsRepository.rootModel.find(
      {},
    );

    // Use specific flow for optimum mode
    // Google APIs
    // Create matrix
    // Send to EngineAPI
    // Create osrp link

    return;
  }

  async createRoute() {
    const route = await this.routesRepository.rootModel.create({
      name: 'Some Name',
    });
    return route;
  }

  async getRouteById(id: ObjectId) {
    const route = await this.routesRepository.rootModel.findById(id);
    console.log(route);

    return { route };
  }
}
