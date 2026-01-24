import { Injectable } from '@nestjs/common';
import { LocationsRepository } from 'src/repository/locations.repository';
import type {
  CreateLocationRequest,
  GetAllLocationsQuery,
  ObjectIdString,
} from 'node-api-contracts';

@Injectable()
export class LocationsService {
  constructor(private readonly locationsRepository: LocationsRepository) {}

  async getAllLocations(query: GetAllLocationsQuery) {
    return this.locationsRepository.findAll(query);
  }

  async getLocationById(id: ObjectIdString) {
    return this.locationsRepository.findById(id);
  }

  async createLocation(data: CreateLocationRequest) {
    return this.locationsRepository.create(data);
  }

  async deleteLocation(id: ObjectIdString) {
    return this.locationsRepository.deleteById(id);
  }
}
