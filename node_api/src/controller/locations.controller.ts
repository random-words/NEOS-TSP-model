import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { LocationsService } from 'src/service/locations.service';
import { LocationsControllerMap } from './controllers.map';

@Controller(LocationsControllerMap.name)
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post(LocationsControllerMap.CREATE)
  async createLocation(@Body() body) {
    return await this.locationsService.createLocation(body.data);
  }

  @Get(LocationsControllerMap.GET_ALL)
  async getAllLocations() {
    return await this.locationsService.getAllLocations();
  }

  @Get(LocationsControllerMap.GET_BY_ID)
  async getLocationById(@Param('id') id) {
    return await this.locationsService.getLocationById(id);
  }

  @Delete(LocationsControllerMap.DELETE)
  async deleteLocation(@Param('id') id) {
    return await this.locationsService.deleteLocation(id);
  }
}
