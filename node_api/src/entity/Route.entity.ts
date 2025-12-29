import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RouteDocument = HydratedDocument<Route>;

@Schema()
export class Route {
  @Prop()
  name: string;
}

export const RouteSchema = SchemaFactory.createForClass(Route);
