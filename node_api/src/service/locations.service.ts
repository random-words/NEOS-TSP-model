import { Injectable } from '@nestjs/common';

@Injectable()
export class LocationsService {
  constructor() {}

  async getAllLocations() {
    await new Promise(() => console.log('Fetching all locations'));
    return [
      { id: 1, name: 'Location A' },
      { id: 2, name: 'Location B' },
    ];
  }
}
