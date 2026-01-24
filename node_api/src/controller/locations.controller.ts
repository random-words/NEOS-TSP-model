import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { LocationsService } from 'src/service/locations.service';
import { LocationsControllerMap } from 'node-api-contracts';

import {
  CreateLocationDto,
  GetAllLocationsQueryDto,
  LocationIdParamDto,
  DeleteLocationParamDto,
} from './dto/locations.dto';

@Controller(LocationsControllerMap.name)
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post(LocationsControllerMap.CREATE)
  async createLocation(@Body() dto: CreateLocationDto) {
    return await this.locationsService.createLocation(dto);
  }

  @Get(LocationsControllerMap.GET_ALL)
  async getAllLocations(@Query() q: GetAllLocationsQueryDto) {
    return await this.locationsService.getAllLocations(q);
  }

  @Get(LocationsControllerMap.GET_BY_ID)
  async getLocationById(@Param() params: LocationIdParamDto) {
    return await this.locationsService.getLocationById(params.id);
  }

  @Delete(LocationsControllerMap.DELETE)
  async deleteLocation(@Param() params: DeleteLocationParamDto) {
    return await this.locationsService.deleteLocation(params.id);
  }
}
