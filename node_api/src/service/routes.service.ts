import { Injectable } from '@nestjs/common';

@Injectable()
export class RoutesService {
  constructor() {}

  async optimizeRoute() {
    const openStreetMapUrl = `https://router.project-osrm.org/route/v1/driving/LNG,LAT;LNG,LAT?overview=full&geometries=geojson`;

    return;
  }
}
