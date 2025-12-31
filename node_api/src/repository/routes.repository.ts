import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Route } from 'src/entity/Route.entity';

@Injectable()
export class RoutesRepository {
  constructor(
    @InjectModel(Route.name) private readonly routeModel: Model<Route>,
  ) {}
}
