import mongoose from 'mongoose';

const airwayRouteSchema = new mongoose.Schema(
  {
    airwayId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TaxiAirway',
      required: true,
      index: true,
    },
    routeName: {
      type: String,
      required: true,
      trim: true,
    },
    flightNumber: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    originAirport: {
      type: String,
      default: '',
      trim: true,
      uppercase: true,
    },
    destinationAirport: {
      type: String,
      default: '',
      trim: true,
      uppercase: true,
    },
    distanceKm: {
      type: Number,
      default: 0,
      min: 0,
    },
    durationMinutes: {
      type: Number,
      default: 0,
      min: 0,
    },
    departureTime: {
      type: String,
      default: '',
      trim: true,
    },
    arrivalTime: {
      type: String,
      default: '',
      trim: true,
    },
    operatingDays: {
      type: [String],
      default: [],
    },
    seatInventory: {
      type: Map,
      of: Number,
      default: {},
    },
    routeStatus: {
      type: String,
      enum: ['scheduled', 'seasonal', 'paused'],
      default: 'scheduled',
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { timestamps: true },
);

airwayRouteSchema.index({ airwayId: 1, routeStatus: 1 });
airwayRouteSchema.index({ originAirport: 1, destinationAirport: 1 });
airwayRouteSchema.index({ routeName: 1, flightNumber: 1 });

export const AirwayRoute =
  mongoose.models.TaxiAirwayRoute ||
  mongoose.model('TaxiAirwayRoute', airwayRouteSchema);
