import mongoose from 'mongoose';
import { Airway } from '../../admin/models/Airway.js';
import { AirwayRoute } from '../../admin/models/AirwayRoute.js';
import { AirwayBooking } from '../../admin/models/AirwayBooking.js';
import { ApiError } from '../../../../utils/ApiError.js';
import { asyncHandler } from '../../../../utils/asyncHandler.js';

const ok = (res, data, message) => res.status(200).json({ success: true, data, message });
const created = (res, data, message) => res.status(201).json({ success: true, data, message });

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const toText = (value = '') => String(value || '').trim();
const toLower = (value = '') => toText(value).toLowerCase();
const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const getTravelDayToken = (value) => {
  const parsed = value ? new Date(value) : null;
  if (!parsed || Number.isNaN(parsed.getTime())) {
    return '';
  }
  return DAY_LABELS[parsed.getDay()] || '';
};

const getCurrentUserId = (req) => String(req.auth?.sub || req.user?._id || '').trim();

const getSeatInventoryObject = (seatInventory) =>
  seatInventory instanceof Map
    ? Object.fromEntries(seatInventory.entries())
    : seatInventory && typeof seatInventory === 'object'
      ? Object.fromEntries(Object.entries(seatInventory))
      : {};

const getAvailableSeatCount = (route = {}) =>
  Math.max(0, toNumber(getSeatInventoryObject(route.seatInventory)['Helicopter Cabin'], 0));

const serializeAirway = (item = {}) => ({
  id: String(item._id || item.id || ''),
  airlineName: item.airlineName || '',
  airlineCode: item.airlineCode || '',
  aircraftModel: item.aircraftModel || 'Helicopter',
  registrationCode: item.registrationCode || '',
  baseAirport: item.baseAirport || '',
  pilotName: item.pilotName || '',
  pilotPhone: item.pilotPhone || '',
  seatCapacity: toNumber(item.seatCapacity, 0),
  basePrice: toNumber(item.basePrice, 0),
  serviceTaxPercent: toNumber(item.serviceTaxPercent, 0),
  status: item.status || 'active',
  notes: item.notes || '',
});

const serializeRoute = (route = {}, airway = null) => {
  const serializedAirway = airway ? serializeAirway(airway) : null;
  const baseFare = toNumber(serializedAirway?.basePrice, 0);
  const serviceTaxPercent = toNumber(serializedAirway?.serviceTaxPercent, 0);
  const serviceTaxAmount = (baseFare * serviceTaxPercent) / 100;

  return {
    id: String(route._id || route.id || ''),
    airwayId: String(route.airwayId?._id || route.airwayId || serializedAirway?.id || ''),
    routeName: route.routeName || '',
    flightNumber: route.flightNumber || '',
    originAirport: route.originAirport || '',
    destinationAirport: route.destinationAirport || '',
    distanceKm: toNumber(route.distanceKm, 0),
    durationMinutes: toNumber(route.durationMinutes, 0),
    departureTime: route.departureTime || '',
    arrivalTime: route.arrivalTime || '',
    operatingDays: Array.isArray(route.operatingDays) ? route.operatingDays : [],
    seatInventory: getSeatInventoryObject(route.seatInventory),
    routeStatus: route.routeStatus || 'scheduled',
    notes: route.notes || '',
    airway: serializedAirway,
    availableSeats: getAvailableSeatCount(route),
    baseFare,
    serviceTaxPercent,
    serviceTaxAmount,
    totalFare: baseFare + serviceTaxAmount,
    createdAt: route.createdAt || null,
    updatedAt: route.updatedAt || null,
  };
};

const serializeBooking = (item = {}) => ({
  id: String(item._id || item.id || ''),
  bookingCode: item.bookingCode || '',
  airwayId: String(item.airwayId?._id || item.airwayId || ''),
  airwayName: item.airwayName || item.airwayId?.airlineName || '',
  routeId: String(item.routeId?._id || item.routeId || ''),
  routeName: item.routeName || item.routeId?.routeName || '',
  flightNumber: item.flightNumber || item.routeId?.flightNumber || '',
  customerName: item.customerName || '',
  customerPhone: item.customerPhone || '',
  customerEmail: item.customerEmail || '',
  seatClass: item.seatClass || 'Helicopter Cabin',
  seatCount: toNumber(item.seatCount, 0),
  subtotalFare: toNumber(item.subtotalFare, 0),
  serviceTaxAmount: toNumber(item.serviceTaxAmount, 0),
  serviceTaxPercent: toNumber(item.serviceTaxPercent, 0),
  totalFare: toNumber(item.totalFare, 0),
  travelDate: item.travelDate || null,
  paymentMethod: item.paymentMethod || 'reserve',
  paymentMethodLabel: item.paymentMethodLabel || '',
  paymentStatus: item.paymentStatus || 'pending',
  bookingStatus: item.bookingStatus || 'confirmed',
  notes: item.notes || '',
  passengerNames: Array.isArray(item.passengerNames) ? item.passengerNames : [],
  gatewaySlug: item.gatewaySlug || '',
  createdAt: item.createdAt || null,
  updatedAt: item.updatedAt || null,
});

const buildBookingCode = () =>
  `HL-${new mongoose.Types.ObjectId().toString().slice(-6).toUpperCase()}`;

export const searchAirwayRoutes = asyncHandler(async (req, res) => {
  const { origin = '', destination = '', query = '', travelDate = '' } = req.query;
  const routes = await AirwayRoute.find({
    routeStatus: 'scheduled',
    ...(origin ? { originAirport: { $regex: toText(origin), $options: 'i' } } : {}),
    ...(destination ? { destinationAirport: { $regex: toText(destination), $options: 'i' } } : {}),
  })
    .populate('airwayId')
    .sort({ createdAt: -1 })
    .lean();

  const dayToken = getTravelDayToken(travelDate);
  const queryToken = toLower(query);
  const results = routes
    .filter((route) => {
      const airway = route.airwayId;
      if (!airway || toLower(airway.status) !== 'active') {
        return false;
      }
      if (getAvailableSeatCount(route) <= 0) {
        return false;
      }
      if (dayToken && !(Array.isArray(route.operatingDays) ? route.operatingDays : []).includes(dayToken)) {
        return false;
      }
      if (!queryToken) {
        return true;
      }
      const haystack = [
        route.routeName,
        route.flightNumber,
        route.originAirport,
        route.destinationAirport,
        airway.airlineName,
        airway.airlineCode,
        airway.pilotName,
        airway.baseAirport,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(queryToken);
    })
    .map((route) => serializeRoute(route, route.airwayId));

  return ok(res, results, 'Airway routes fetched successfully');
});

export const getAirwayRouteDetails = asyncHandler(async (req, res) => {
  const route = await AirwayRoute.findById(req.params.id).populate('airwayId').lean();
  if (!route || !route.airwayId) {
    throw new ApiError(404, 'Airway route not found');
  }
  if (toLower(route.airwayId.status) !== 'active' || toLower(route.routeStatus) !== 'scheduled') {
    throw new ApiError(404, 'Airway route is not available right now');
  }

  return ok(res, serializeRoute(route, route.airwayId), 'Airway route fetched successfully');
});

export const createAirwayBooking = asyncHandler(async (req, res) => {
  const userId = getCurrentUserId(req);
  if (!userId) {
    throw new ApiError(401, 'User authentication is required');
  }

  const route = await AirwayRoute.findById(req.body?.routeId).populate('airwayId');
  if (!route || !route.airwayId) {
    throw new ApiError(404, 'Selected helicopter route is no longer available');
  }
  if (toLower(route.airwayId.status) !== 'active' || toLower(route.routeStatus) !== 'scheduled') {
    throw new ApiError(400, 'Selected helicopter route is not available right now');
  }

  const customerName = toText(req.body?.customerName);
  const customerPhone = toText(req.body?.customerPhone);
  if (!customerName || !customerPhone) {
    throw new ApiError(400, 'Passenger contact name and phone are required');
  }

  const seatCount = Math.max(1, toNumber(req.body?.seatCount, 1));
  const availableSeats = getAvailableSeatCount(route);
  if (seatCount > availableSeats) {
    throw new ApiError(400, `Only ${availableSeats} seat${availableSeats === 1 ? '' : 's'} left on this route`);
  }

  const passengerNames = Array.isArray(req.body?.passengerNames)
    ? req.body.passengerNames.map((item) => toText(item)).filter(Boolean)
    : [];
  if (passengerNames.length !== seatCount) {
    throw new ApiError(400, 'Please enter every passenger name before booking');
  }

  const subtotalFare = Math.max(0, toNumber(req.body?.subtotalFare, toNumber(route.airwayId.basePrice, 0) * seatCount));
  const serviceTaxPercent = Math.max(0, toNumber(req.body?.serviceTaxPercent, route.airwayId.serviceTaxPercent || 0));
  const serviceTaxAmount = Math.max(0, toNumber(req.body?.serviceTaxAmount, (subtotalFare * serviceTaxPercent) / 100));
  const totalFare = Math.max(0, toNumber(req.body?.totalFare, subtotalFare + serviceTaxAmount));

  const booking = await AirwayBooking.create({
    bookingCode: buildBookingCode(),
    userId,
    airwayId: route.airwayId._id,
    routeId: route._id,
    airwayName: route.airwayId.airlineName || '',
    routeName: route.routeName || '',
    flightNumber: route.flightNumber || '',
    customerName,
    customerPhone,
    customerEmail: toText(req.body?.customerEmail).toLowerCase(),
    seatClass: 'Helicopter Cabin',
    seatCount,
    subtotalFare,
    serviceTaxAmount,
    serviceTaxPercent,
    totalFare,
    travelDate: req.body?.travelDate ? new Date(req.body.travelDate) : new Date(),
    paymentMethod: toLower(req.body?.paymentMethod) === 'online' ? 'online' : 'reserve',
    paymentMethodLabel: toText(req.body?.paymentMethodLabel),
    paymentStatus: ['pending', 'paid', 'failed', 'refunded'].includes(toLower(req.body?.paymentStatus))
      ? toLower(req.body?.paymentStatus)
      : 'pending',
    bookingStatus: 'confirmed',
    notes: toText(req.body?.notes),
    passengerNames,
    gatewaySlug: toText(req.body?.gatewaySlug),
  });

  const currentInventory = getSeatInventoryObject(route.seatInventory);
  route.seatInventory = {
    ...currentInventory,
    'Helicopter Cabin': Math.max(0, availableSeats - seatCount),
  };
  await route.save();

  return created(res, serializeBooking(booking), 'Airway booking created successfully');
});

export const getMyAirwayBooking = asyncHandler(async (req, res) => {
  const userId = getCurrentUserId(req);
  const booking = await AirwayBooking.findOne({
    _id: req.params.id,
    userId,
  }).lean();

  if (!booking) {
    throw new ApiError(404, 'Airway booking not found');
  }

  return ok(res, serializeBooking(booking), 'Airway booking fetched successfully');
});
