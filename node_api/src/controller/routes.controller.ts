import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { RoutesService } from 'src/service/routes.service';
import { RoutesControllerMap } from 'node-api-contracts';

import {
  CreateRouteDto,
  UpdateRouteDto,
  OptimizeRouteDto,
  GetAllRoutesQueryDto,
  RouteIdParamDto,
  DeleteRouteParamDto,
  UpdateRouteParamDto,
  OptimizeRouteParamDto,
} from './dto/routes.dto';

@Controller(RoutesControllerMap.name)
export class RoutesController {
  constructor(private readonly routeService: RoutesService) {}

  @Post(RoutesControllerMap.CREATE)
  async createRoute(@Body() dto: CreateRouteDto) {
    return await this.routeService.createRoute(dto);
  }

  @Get(RoutesControllerMap.GET_ALL)
  async getAllRoutes(@Query() q: GetAllRoutesQueryDto) {
    return await this.routeService.getAllRoutes(q);
  }

  @Get(RoutesControllerMap.GET_BY_ID)
  async getRouteById(@Param() params: RouteIdParamDto) {
    return await this.routeService.getRouteById(params.id);
  }

  @Patch(RoutesControllerMap.UPDATE)
  async updateRoute(
    @Param() params: UpdateRouteParamDto,
    @Body() dto: UpdateRouteDto,
  ) {
    return await this.routeService.updateRoute(params.id, dto);
  }

  @Delete(RoutesControllerMap.DELETE)
  async deleteRoute(@Param() params: DeleteRouteParamDto) {
    return await this.routeService.deleteRoute(params.id);
  }

  @Post(RoutesControllerMap.OPTIMIZE) // ':id/optimize'
  async optimizeRoute(
    @Param() params: OptimizeRouteParamDto,
    @Body() dto: OptimizeRouteDto,
  ) {
    return await this.routeService.optimizeRoute(dto);
  }

  @Get(RoutesControllerMap.GET_ANCHORS)
  async getRouteAnchors() {
    return await this.routeService.getRouteAnchors();
  }
}
