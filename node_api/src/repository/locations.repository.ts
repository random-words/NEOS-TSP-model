import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import type {
  CreateLocationRequest,
  GetAllLocationsQuery,
  ObjectIdString,
} from 'node-api-contracts';
import { Location, LocationDocument } from 'src/entity/Location.entity';

@Injectable()
export class LocationsRepository {
  constructor(
    @InjectModel(Location.name)
    private readonly locationModel: Model<LocationDocument>,
  ) {}

  async findAll(q: GetAllLocationsQuery) {
    const skip = (q.page - 1) * q.limit;

    const [items, total] = await Promise.all([
      this.locationModel.find().skip(skip).limit(q.limit).lean(),
      this.locationModel.countDocuments(),
    ]);

    return { items, total };
  }

  async findById(id: ObjectIdString) {
    return this.locationModel.findById(id).lean();
  }

  async create(data: CreateLocationRequest) {
    const doc = await this.locationModel.create(data);
    return doc.toObject();
  }

  async deleteById(id: ObjectIdString) {
    return this.locationModel.findByIdAndDelete(id).lean();
  }

  findByIds(ids: Array<ObjectIdString | Types.ObjectId>) {
    return this.locationModel.find({ _id: { $in: ids } }).lean();
  }
}
