const AIRWAYS_STORAGE_KEY = 'taxiAdminAirwaysCatalog';
const AIRWAY_ROUTES_STORAGE_KEY = 'taxiAdminAirwaysRoutes';
const AIRWAY_BOOKINGS_STORAGE_KEY = 'taxiAdminAirwaysBookings';

const createId = (prefix = 'item') => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

const readJsonStorage = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const writeJsonStorage = (key, value) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

const createHelicopterSeatClass = (overrides = {}) => ({
  id: createId('seat-class'),
  cabin: 'Helicopter Cabin',
  seatCode: 'HELI',
  seatCount: 6,
  fare: 8500,
  ...overrides,
});

const buildHelicopterSeatClasses = (payload = {}) => [
  createHelicopterSeatClass({
    seatCount: Number(payload.seatCapacity || 0),
    fare: Number(payload.basePrice || 0),
  }),
];

export const createAirwayDraft = () => ({
  id: createId('airway'),
  airlineName: '',
  airlineCode: '',
  aircraftModel: 'Helicopter',
  registrationCode: '',
  baseAirport: '',
  pilotName: '',
  pilotPhone: '',
  seatCapacity: 6,
  basePrice: 8500,
  serviceTaxPercent: 5,
  status: 'draft',
  notes: '',
  seatClasses: buildHelicopterSeatClasses({ seatCapacity: 6, basePrice: 8500 }),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const createAirwayRouteDraft = () => ({
  id: createId('air-route'),
  airwayId: '',
  routeName: '',
  flightNumber: '',
  originAirport: '',
  destinationAirport: '',
  distanceKm: 0,
  durationMinutes: 45,
  departureTime: '09:00',
  arrivalTime: '09:45',
  operatingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  seatInventory: {
    'Helicopter Cabin': 6,
  },
  routeStatus: 'scheduled',
  notes: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const createBookingDraft = (route, airway, overrides = {}) => ({
  id: createId('booking'),
  bookingCode: `HL-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
  airwayId: airway?.id || '',
  airwayName: airway?.airlineName || '',
  routeId: route?.id || '',
  routeName: route?.routeName || '',
  flightNumber: route?.flightNumber || '',
  customerName: 'Guest Passenger',
  seatClass: 'Helicopter Cabin',
  seatCount: 1,
  totalFare: Number(airway?.basePrice || 8500),
  travelDate: new Date(Date.now() + 86400000).toISOString(),
  paymentStatus: 'paid',
  bookingStatus: 'confirmed',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

const normalizeAirways = (items = []) =>
  items.map((item) => {
    const defaultDraft = createAirwayDraft();
    const seatCapacity = Number(
      item.seatCapacity ??
      item.seatClasses?.[0]?.seatCount ??
      defaultDraft.seatCapacity,
    );
    const basePrice = Number(
      item.basePrice ??
      item.seatClasses?.[0]?.fare ??
      defaultDraft.basePrice,
    );

    return {
      ...defaultDraft,
      ...item,
      aircraftModel: item.aircraftModel || 'Helicopter',
      seatCapacity,
      basePrice,
      serviceTaxPercent: Number(item.serviceTaxPercent ?? defaultDraft.serviceTaxPercent),
      pilotName: item.pilotName || '',
      pilotPhone: item.pilotPhone || item.supportPhone || '',
      seatClasses: buildHelicopterSeatClasses({ seatCapacity, basePrice }),
    };
  });

const normalizeRoutes = (items = []) =>
  items.map((item) => ({
    ...createAirwayRouteDraft(),
    ...item,
    operatingDays: Array.isArray(item.operatingDays) ? item.operatingDays : [],
    seatInventory:
      item?.seatInventory && typeof item.seatInventory === 'object'
        ? item.seatInventory
        : createAirwayRouteDraft().seatInventory,
  }));

const normalizeBookings = (items = []) =>
  items.map((item) => ({
    ...createBookingDraft(),
    ...item,
    seatClass: item.seatClass || 'Helicopter Cabin',
  }));

const getStoredAirways = () => normalizeAirways(readJsonStorage(AIRWAYS_STORAGE_KEY, []));
const getStoredRoutes = () => normalizeRoutes(readJsonStorage(AIRWAY_ROUTES_STORAGE_KEY, []));
const getStoredBookings = () => normalizeBookings(readJsonStorage(AIRWAY_BOOKINGS_STORAGE_KEY, []));

const persistAirways = (items) => writeJsonStorage(AIRWAYS_STORAGE_KEY, items);
const persistRoutes = (items) => writeJsonStorage(AIRWAY_ROUTES_STORAGE_KEY, items);
const persistBookings = (items) => writeJsonStorage(AIRWAY_BOOKINGS_STORAGE_KEY, items);

const createDefaultSeedAirways = () => ([
  createAirwayDraft({
    airlineName: 'Himalayan Heli Tours',
    airlineCode: 'HHT',
    registrationCode: 'VT-HHT-01',
    baseAirport: 'DEHRADUN',
    pilotName: 'Captain Rohan Negi',
    pilotPhone: '+91 98765 22001',
    seatCapacity: 6,
    basePrice: 9500,
    serviceTaxPercent: 5,
    status: 'active',
    notes: 'Primary charter helicopter for short regional sectors and temple transfers.',
    seatClasses: buildHelicopterSeatClasses({ seatCapacity: 6, basePrice: 9500 }),
  }),
  createAirwayDraft({
    airlineName: 'SkyLift Charters',
    airlineCode: 'SLC',
    registrationCode: 'VT-SLC-07',
    baseAirport: 'SHIMLA',
    pilotName: 'Captain Neha Rana',
    pilotPhone: '+91 98765 22007',
    seatCapacity: 5,
    basePrice: 11200,
    serviceTaxPercent: 5,
    status: 'active',
    notes: 'Premium helicopter used for hill transfers and VIP hops.',
    seatClasses: buildHelicopterSeatClasses({ seatCapacity: 5, basePrice: 11200 }),
  }),
]);

const shouldResetLegacyAirwayData = (airways = []) =>
  airways.some(
    (item) =>
      item.operatorType ||
      item.supportEmail ||
      /airbus|boeing/i.test(String(item.aircraftModel || '')) ||
      /skybridge airways/i.test(String(item.airlineName || '')),
  );

const ensureSeedData = () => {
  const airways = getStoredAirways();
  const routes = getStoredRoutes();
  const bookings = getStoredBookings();

  if (airways.length === 0 || shouldResetLegacyAirwayData(airways)) {
    persistAirways(createDefaultSeedAirways());
    persistRoutes([]);
    persistBookings([]);
  }

  const refreshedAirways = getStoredAirways();

  if (routes.length === 0 && refreshedAirways.length > 0) {
    const primaryAirway = refreshedAirways[0];
    const seededRoutes = [
      createAirwayRouteDraft({
        airwayId: primaryAirway.id,
        routeName: 'Dehradun to Kedarnath Shuttle',
        flightNumber: 'HHT101',
        originAirport: 'DEHRADUN',
        destinationAirport: 'KEDARNATH',
        distanceKm: 52,
        durationMinutes: 32,
        departureTime: '06:30',
        arrivalTime: '07:02',
        operatingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        seatInventory: {
          'Helicopter Cabin': Number(primaryAirway.seatCapacity || 6),
        },
        routeStatus: 'scheduled',
      }),
    ];
    persistRoutes(seededRoutes);
  }

  const refreshedRoutes = getStoredRoutes();

  if (bookings.length === 0 && refreshedRoutes.length > 0) {
    const firstRoute = refreshedRoutes[0];
    const firstAirway = refreshedAirways.find((item) => item.id === firstRoute.airwayId) || refreshedAirways[0];
    const seatCountOneFare = Number(firstAirway?.basePrice || 9500);
    persistBookings([
      createBookingDraft(firstRoute, firstAirway, {
        customerName: 'Aarav Mehta',
        seatCount: 2,
        totalFare: seatCountOneFare * 2,
      }),
      createBookingDraft(firstRoute, firstAirway, {
        customerName: 'Sara Khan',
        seatCount: 1,
        totalFare: seatCountOneFare,
        bookingStatus: 'checked_in',
      }),
    ]);
  }
};

export const getAdminAirways = async () => {
  ensureSeedData();
  return getStoredAirways();
};

export const upsertAdminAirway = async (payload = {}) => {
  ensureSeedData();
  const airways = getStoredAirways();
  const existingIndex = airways.findIndex((item) => item.id === payload.id);
  const seatCapacity = Number(payload.seatCapacity || 0);
  const basePrice = Number(payload.basePrice || 0);
  const nextAirway = {
    ...createAirwayDraft(),
    ...payload,
    id: payload.id || createId('airway'),
    aircraftModel: 'Helicopter',
    seatCapacity,
    basePrice,
    serviceTaxPercent: Number(payload.serviceTaxPercent || 0),
    updatedAt: new Date().toISOString(),
    createdAt: payload.createdAt || new Date().toISOString(),
    seatClasses: buildHelicopterSeatClasses({ seatCapacity, basePrice }),
  };

  if (existingIndex >= 0) {
    airways[existingIndex] = nextAirway;
  } else {
    airways.unshift(nextAirway);
  }

  persistAirways(airways);

  const routes = getStoredRoutes().map((route) => {
    if (route.airwayId !== nextAirway.id) return route;
    return {
      ...route,
      seatInventory: {
        'Helicopter Cabin': Number(route.seatInventory?.['Helicopter Cabin'] ?? nextAirway.seatCapacity),
      },
      updatedAt: new Date().toISOString(),
    };
  });
  persistRoutes(routes);

  return nextAirway;
};

export const deleteAdminAirway = async (airwayId) => {
  const airways = getStoredAirways().filter((item) => item.id !== airwayId);
  const routes = getStoredRoutes().filter((item) => item.airwayId !== airwayId);
  const bookings = getStoredBookings().filter((item) => item.airwayId !== airwayId);

  persistAirways(airways);
  persistRoutes(routes);
  persistBookings(bookings);
};

export const getAdminAirwayRoutes = async () => {
  ensureSeedData();
  return getStoredRoutes();
};

export const upsertAdminAirwayRoute = async (payload = {}) => {
  ensureSeedData();
  const routes = getStoredRoutes();
  const existingIndex = routes.findIndex((item) => item.id === payload.id);
  const nextRoute = {
    ...createAirwayRouteDraft(),
    ...payload,
    id: payload.id || createId('air-route'),
    distanceKm: Number(payload.distanceKm || 0),
    durationMinutes: Number(payload.durationMinutes || 0),
    updatedAt: new Date().toISOString(),
    createdAt: payload.createdAt || new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    routes[existingIndex] = nextRoute;
  } else {
    routes.unshift(nextRoute);
  }

  persistRoutes(routes);
  return nextRoute;
};

export const deleteAdminAirwayRoute = async (routeId) => {
  const routes = getStoredRoutes().filter((item) => item.id !== routeId);
  const bookings = getStoredBookings().filter((item) => item.routeId !== routeId);
  persistRoutes(routes);
  persistBookings(bookings);
};

export const getAdminAirwayBookings = async () => {
  ensureSeedData();
  return getStoredBookings();
};

export const updateAdminAirwayBookingStatus = async (bookingId, bookingStatus) => {
  const bookings = getStoredBookings();
  const nextBookings = bookings.map((item) =>
    item.id === bookingId ? { ...item, bookingStatus, updatedAt: new Date().toISOString() } : item,
  );
  persistBookings(nextBookings);
  return nextBookings.find((item) => item.id === bookingId) || null;
};

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const normalizeText = (value = '') => String(value || '').trim().toLowerCase();

const getAvailableSeatCount = (route = {}) =>
  Math.max(0, Number(route?.seatInventory?.['Helicopter Cabin'] || 0));

const getTravelDayToken = (value) => {
  const parsed = value ? new Date(value) : null;
  if (!parsed || Number.isNaN(parsed.getTime())) {
    return '';
  }
  return DAY_LABELS[parsed.getDay()] || '';
};

const enrichRoute = (route = {}, airwayMap = new Map()) => {
  const airway = airwayMap.get(route.airwayId) || null;
  const availableSeats = getAvailableSeatCount(route);
  const baseFare = Number(airway?.basePrice || 0);
  const serviceTaxPercent = Number(airway?.serviceTaxPercent || 0);
  const serviceTaxAmount = (baseFare * serviceTaxPercent) / 100;

  return {
    ...route,
    airway,
    availableSeats,
    baseFare,
    serviceTaxPercent,
    serviceTaxAmount,
    totalFare: baseFare + serviceTaxAmount,
  };
};

const matchesRouteSearch = (route = {}, airway = {}, filters = {}) => {
  const origin = normalizeText(filters.origin);
  const destination = normalizeText(filters.destination);
  const query = normalizeText(filters.query);
  const travelDate = String(filters.travelDate || '').trim();
  const dayToken = getTravelDayToken(travelDate);

  if (origin && !normalizeText(route.originAirport).includes(origin)) {
    return false;
  }

  if (destination && !normalizeText(route.destinationAirport).includes(destination)) {
    return false;
  }

  if (query) {
    const haystack = [
      route.routeName,
      route.flightNumber,
      route.originAirport,
      route.destinationAirport,
      airway?.airlineName,
      airway?.airlineCode,
      airway?.pilotName,
      airway?.baseAirport,
    ]
      .join(' ')
      .toLowerCase();

    if (!haystack.includes(query)) {
      return false;
    }
  }

  if (dayToken && !(route.operatingDays || []).includes(dayToken)) {
    return false;
  }

  return true;
};

export const getUserAirwayRoutes = async (filters = {}) => {
  ensureSeedData();
  const airways = getStoredAirways().filter((item) => String(item.status || '').toLowerCase() === 'active');
  const airwayMap = new Map(airways.map((item) => [item.id, item]));

  return getStoredRoutes()
    .filter((route) => {
      const airway = airwayMap.get(route.airwayId);
      if (!airway) return false;
      if (String(route.routeStatus || '').toLowerCase() !== 'scheduled') return false;
      if (getAvailableSeatCount(route) <= 0) return false;
      return matchesRouteSearch(route, airway, filters);
    })
    .map((route) => enrichRoute(route, airwayMap))
    .sort((left, right) => {
      const leftSeats = getAvailableSeatCount(left);
      const rightSeats = getAvailableSeatCount(right);
      return rightSeats - leftSeats;
    });
};

export const getUserAirwayRoute = async (routeId) => {
  ensureSeedData();
  const airways = getStoredAirways();
  const airwayMap = new Map(airways.map((item) => [item.id, item]));
  const route = getStoredRoutes().find((item) => String(item.id) === String(routeId));
  return route ? enrichRoute(route, airwayMap) : null;
};

export const getUserAirwayBooking = async (bookingId) => {
  ensureSeedData();
  return getStoredBookings().find((item) => String(item.id) === String(bookingId)) || null;
};

export const createUserAirwayBooking = async (payload = {}) => {
  ensureSeedData();

  const routes = getStoredRoutes();
  const airways = getStoredAirways();
  const routeIndex = routes.findIndex((item) => String(item.id) === String(payload.routeId));

  if (routeIndex < 0) {
    throw new Error('Selected helicopter route is no longer available.');
  }

  const route = routes[routeIndex];
  const airway = airways.find((item) => item.id === route.airwayId);

  if (!airway) {
    throw new Error('Selected helicopter is not available right now.');
  }

  const seatCount = Math.max(1, Number(payload.seatCount || 1));
  const availableSeats = getAvailableSeatCount(route);

  if (seatCount > availableSeats) {
    throw new Error(`Only ${availableSeats} seat${availableSeats === 1 ? '' : 's'} left on this route.`);
  }

  const subtotalFare = Number(payload.subtotalFare || airway.basePrice * seatCount);
  const serviceTaxPercent = Number(payload.serviceTaxPercent ?? airway.serviceTaxPercent ?? 0);
  const serviceTaxAmount = Number(payload.serviceTaxAmount ?? (subtotalFare * serviceTaxPercent) / 100);
  const totalFare = Number(payload.totalFare ?? subtotalFare + serviceTaxAmount);
  const paymentMethod = String(payload.paymentMethod || 'reserve').trim().toLowerCase();
  const paymentStatus = String(payload.paymentStatus || (paymentMethod === 'online' ? 'paid' : 'pending')).trim().toLowerCase();
  const bookingStatus = String(payload.bookingStatus || 'confirmed').trim().toLowerCase();
  const passengerNames = Array.isArray(payload.passengerNames)
    ? payload.passengerNames.filter((item) => String(item || '').trim())
    : [];

  const booking = createBookingDraft(route, airway, {
    customerName: payload.customerName || passengerNames[0] || 'Guest Passenger',
    customerPhone: payload.customerPhone || '',
    customerEmail: payload.customerEmail || '',
    seatCount,
    seatClass: 'Helicopter Cabin',
    travelDate: payload.travelDate || new Date().toISOString(),
    totalFare,
    subtotalFare,
    serviceTaxAmount,
    serviceTaxPercent,
    paymentMethod,
    paymentMethodLabel: payload.paymentMethodLabel || (paymentMethod === 'online' ? 'Online' : 'Reserve now'),
    paymentStatus,
    bookingStatus,
    notes: payload.notes || '',
    passengerNames,
    gatewaySlug: payload.gatewaySlug || '',
  });

  routes[routeIndex] = {
    ...route,
    seatInventory: {
      ...(route.seatInventory || {}),
      'Helicopter Cabin': availableSeats - seatCount,
    },
    updatedAt: new Date().toISOString(),
  };

  const bookings = getStoredBookings();
  bookings.unshift(booking);

  persistRoutes(routes);
  persistBookings(bookings);

  return booking;
};
