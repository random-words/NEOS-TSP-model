import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type {
  // CreateRouteRequest,
  UpdateRouteRequest,
  GetAllRoutesQuery,
  ObjectIdString,
} from 'node-api-contracts';
import { Route, RouteDocument } from 'src/entity/Route.entity';

@Injectable()
export class RoutesRepository {
  constructor(
    @InjectModel(Route.name)
    private readonly routeModel: Model<RouteDocument>,
  ) {}

  async findAll(q: GetAllRoutesQuery) {
    const skip = (q.page - 1) * q.limit;

    const [items, total] = await Promise.all([
      this.routeModel.find().skip(skip).limit(q.limit).lean(),
      this.routeModel.countDocuments(),
    ]);

    return { items, total };
  }

  async findById(id: ObjectIdString) {
    return this.routeModel.findById(id).lean();
  }

  async create(data: any) {
    return await this.routeModel.create(data);
  }

  async updateById(id: ObjectIdString, dto: UpdateRouteRequest) {
    return this.routeModel.findByIdAndUpdate(id, dto, { new: true }).lean();
  }

  async deleteById(id: ObjectIdString) {
    return this.routeModel.findByIdAndDelete(id).lean();
  }
}
