import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Location } from './Location.entity';

export type LocationEdgeDocument = HydratedDocument<LocationEdge>;

@Schema({ versionKey: false, timestamps: true })
export class LocationEdge {
  @Prop({ type: Types.ObjectId, ref: Location.name, required: true })
  from: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Location.name, required: true })
  to: Types.ObjectId;

  @Prop({ required: true, min: 0 }) // meters
  distance: number;

  @Prop({ required: true, min: 0 }) // seconds
  duration: number;
}

export const LocationEdgeSchema = SchemaFactory.createForClass(LocationEdge);

LocationEdgeSchema.index({ from: 1, to: 1 }, { unique: true });
