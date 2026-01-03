import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LocationDocument = HydratedDocument<Location>;

@Schema()
export class Location {
  @Prop({ required: true })
  name: string;

  @Prop(
    raw({
      type: { type: String, enum: ['Point'], default: 'Point', required: true },
      coordinates: { type: [Number], required: true },
    }),
  )
  location: { type: 'Point'; coordinates: [number, number] };
}

export const LocationSchema = SchemaFactory.createForClass(Location);

LocationSchema.index({ location: '2dsphere' });
