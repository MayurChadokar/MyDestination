import mongoose from 'mongoose';

const airwaySeatClassSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: '',
      trim: true,
    },
    cabin: {
      type: String,
      default: 'Helicopter Cabin',
      trim: true,
    },
    seatCode: {
      type: String,
      default: 'HELI',
      trim: true,
    },
    seatCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    fare: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { _id: false },
);

const airwaySchema = new mongoose.Schema(
  {
    airlineName: {
      type: String,
      required: true,
      trim: true,
    },
    airlineCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    aircraftModel: {
      type: String,
      default: 'Helicopter',
      trim: true,
    },
    registrationCode: {
      type: String,
      default: '',
      trim: true,
      uppercase: true,
    },
    baseAirport: {
      type: String,
      default: '',
      trim: true,
      uppercase: true,
    },
    pilotName: {
      type: String,
      default: '',
      trim: true,
    },
    pilotPhone: {
      type: String,
      default: '',
      trim: true,
    },
    seatCapacity: {
      type: Number,
      default: 0,
      min: 0,
    },
    basePrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    serviceTaxPercent: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['draft', 'active', 'paused'],
      default: 'active',
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    seatClasses: {
      type: [airwaySeatClassSchema],
      default: [],
    },
    image: {
      type: String,
      default: '',
    },
    gallery: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

airwaySchema.index({ airlineName: 1, airlineCode: 1 });
airwaySchema.index({ status: 1 });

export const Airway =
  mongoose.models.TaxiAirway ||
  mongoose.model('TaxiAirway', airwaySchema);
