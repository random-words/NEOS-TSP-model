import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Location } from 'src/entity/Location.entity';

@Injectable()
export class LocationsRepository {
  constructor(
    @InjectModel(Location.name) private readonly locationModel: Model<Location>,
  ) {}

  async findAll(): Promise<Location[]> {
    return this.locationModel.find().exec();
  }

  async findById(_id: string): Promise<Location | null> {
    return this.locationModel.findById(_id).exec();
  }

  async create(data: Partial<Location>): Promise<Location> {
    const createdLocation = new this.locationModel(data);
    return createdLocation.save();
  }
}
