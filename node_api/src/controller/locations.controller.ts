import { Controller, Get } from '@nestjs/common';
import { LocationsService } from 'src/service/locations.service';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}
  @Get()
  async getAllLocations() {
    return this.locationsService.getAllLocations();
  }
}
