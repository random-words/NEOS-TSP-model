import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Location } from './Location.entity';

export type RouteDocument = HydratedDocument<Route>;

@Schema({ versionKey: false, timestamps: true })
export class Route {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: Location.name }],
    required: true,
  })
  locationsMap: Types.ObjectId[];

  @Prop({ required: true, min: 0 })
  stopsCount: number;

  @Prop({ required: true, min: 0 }) // meters
  totalDistance: number;

  @Prop({ required: true, min: 0 }) // seconds
  totalTime: number;

  @Prop({ type: [Number], default: [] }) // порядок індексів (MVP)
  visitOrder: number[];
}

export const RouteSchema = SchemaFactory.createForClass(Route);
