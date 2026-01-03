import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { WINE_TYPES, type WineType } from 'node-api-contracts';

export type LocationDocument = HydratedDocument<Location>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Location {
  @Prop({ required: true, trim: true })
  name: string;
  @Prop({ required: true, trim: true })
  description: string;
  @Prop(
    raw({
      type: { type: String, enum: ['Point'], default: 'Point', required: true },
      coordinates: { type: [Number], required: true }, // [lng, lat]
    }),
  )
  location: { type: 'Point'; coordinates: [lng: number, lat: number] };

  @Prop({ required: true, trim: true })
  address: string;

  @Prop({ required: true, min: 0 })
  priceLevel: number;

  @Prop({ type: [String], default: [] })
  imagesLinks: string[];

  @Prop({ required: true, min: 0 })
  avgStayMinutes: number;

  @Prop({ required: true, min: 0 })
  avgTastingPricePerPerson: number;

  @Prop({ required: true, min: 0 })
  avgMealPricePerPerson: number;

  @Prop({ required: true, min: 0 })
  avgBottlePrice: number;

  @Prop({ required: true, trim: true })
  siteUrl: string;

  @Prop({ required: true, trim: true })
  contactNumber: string;

  @Prop({
    type: [String],
    enum: WINE_TYPES as unknown as string[],
    default: [],
  })
  wineTags: WineType[];
}

export const LocationSchema = SchemaFactory.createForClass(Location);

LocationSchema.index({ location: '2dsphere' });
