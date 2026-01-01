import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RoutesControllerMap } from './controllers.map';
import { RoutesService } from 'src/service/routes.service';
import { WINE_TYPES } from 'src/shared/types/business.types';
interface OptimizeRouteParams {
  budgetPerPerson: number;
  peopleCount: number;
  locationCount: number;
  startPointId: string;
  timeLimit: number;
  timePerLocation: number;
  winePreferences: WINE_TYPES[];
}
@Controller(RoutesControllerMap.name)
export class RoutesController {
  constructor(private readonly routeService: RoutesService) {}
  @Post(RoutesControllerMap.CREATE)
  async createRoute() {
    return await this.routeService.createRoute();
  }

  @Post(RoutesControllerMap.OPTIMIZE)
  async optimizeRoute(@Body() dto: OptimizeRouteParams) {
    return await this.routeService.optimizeRoute(dto);
  }

  @Get(RoutesControllerMap.GET_BY_ID)
  async getRouteById(@Param('id') id) {
    return await this.routeService.getRouteById(id);
  }

  @Get(RoutesControllerMap.GET_ANCHORS)
  async getRouteAnchors() {}
}
