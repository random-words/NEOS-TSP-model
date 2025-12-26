import { Controller, Get } from '@nestjs/common';

@Controller('locations')
export class LocationsController {
  @Get()
  async getLocations() {
    return;
  }
}
