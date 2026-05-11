import mongoose from 'mongoose';

const airwayBookingSchema = new mongoose.Schema(
  {
    bookingCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    airwayId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TaxiAirway',
      required: true,
      index: true,
    },
    routeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TaxiAirwayRoute',
      required: true,
      index: true,
    },
    airwayName: {
      type: String,
      default: '',
      trim: true,
    },
    routeName: {
      type: String,
      default: '',
      trim: true,
    },
    flightNumber: {
      type: String,
      default: '',
      trim: true,
      uppercase: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerPhone: {
      type: String,
      default: '',
      trim: true,
    },
    customerEmail: {
      type: String,
      default: '',
      trim: true,
      lowercase: true,
    },
    seatClass: {
      type: String,
      default: 'Helicopter Cabin',
      trim: true,
    },
    seatCount: {
      type: Number,
      default: 1,
      min: 1,
    },
    subtotalFare: {
      type: Number,
      default: 0,
      min: 0,
    },
    serviceTaxAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    serviceTaxPercent: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalFare: {
      type: Number,
      default: 0,
      min: 0,
    },
    travelDate: {
      type: Date,
      required: true,
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ['reserve', 'online'],
      default: 'reserve',
    },
    paymentMethodLabel: {
      type: String,
      default: '',
      trim: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    bookingStatus: {
      type: String,
      enum: ['confirmed', 'checked_in', 'boarding', 'cancelled'],
      default: 'confirmed',
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    passengerNames: {
      type: [String],
      default: [],
    },
    gatewaySlug: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { timestamps: true },
);

export const AirwayBooking =
  mongoose.models.TaxiAirwayBooking ||
  mongoose.model('TaxiAirwayBooking', airwayBookingSchema);
