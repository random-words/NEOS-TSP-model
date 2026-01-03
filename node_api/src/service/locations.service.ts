import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongoose';

@Injectable()
export class LocationsService {
  constructor() {}

  async getAllLocations() {
    // await new Promise(() => console.log('Fetching all locations'));
    return [
      { id: 1, name: 'Location A' },
      { id: 2, name: 'Location B' },
    ];
  }

  async getLocationById({ _id }: { _id: ObjectId }) {
    return;
  }

  async createLocation(data) {
    return;
  }

  async deleteLocation(_id: ObjectId) {
    return;
  }
}
