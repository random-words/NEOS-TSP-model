import { Controller } from '@nestjs/common';
import { RoutesControllerMap } from './controllers.map';

@Controller(RoutesControllerMap.name)
export class RoutesController {}
