import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import cors from 'cors';
import { initializeFirebase } from './config/firebase.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import morgan from 'morgan';

// Initialize Firebase
initializeFirebase();

// Initialize Cron Jobs
import './services/cronService.js';



const app = express();
const server = createServer(app); // Create HTTP server
const PORT = process.env.PORT || 5000;

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:5174',
      'http://127.0.0.1:5174',
      'http://localhost:5175',
      'http://127.0.0.1:5175',
      'https://rukkoo.in',
      'https://www.rukkoo.in',
      'https://rukkoo-project.vercel.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
  }
});

// Socket.io Logic
io.on('connection', (socket) => {
  console.log('🔌 New Client Connected:', socket.id);

  // User joins a tracking room (e.g., their booking ID or just a hotel room)
  socket.on('join_tracking', (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
  });

  // User emits location updates
  socket.on('update_location', (data) => {
    const { room, location } = data;
    // Broadcast to others in the room (e.g., Hotel Dashboard)
    socket.to(room).emit('live_location_update', location);
    // console.log(`Location update from ${socket.id} in ${room}:`, location);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

configureTaxiSocketServer(server);

// Middleware
app.use(morgan('dev'));
// Middleware to log request start
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] Incoming Request: ${req.method} ${req.url}`);
  next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Dynamic CORS to allow local network IPs (192.168.x.x) and localhost
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Check if origin is localhost or local network IP
    const allowedOrigins = [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:5174',
      'http://127.0.0.1:5174',
      'http://localhost:5175',
      'http://127.0.0.1:5175',
      'https://rukkoo.in',
      'https://www.rukkoo.in',
      'https://rukkoo-project.vercel.app',
      'https://rukooin-ijcelh2vj-appzetos-projects-73814664.vercel.app'
    ];
    // Add 172.16-31 range (often used by hotspots) and 10.x
    const isLocalNetwork =
      origin.startsWith('http://192.168.') ||
      origin.startsWith('http://10.') ||
      origin.startsWith('http://172.');

    if (allowedOrigins.indexOf(origin) !== -1 || isLocalNetwork) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin); // Log blocked origin for debugging
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Added OPTIONS
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

// Routes
import authRoutes from './modules/auth/routes/authRoutes.js';
import userRoutes from './modules/user/routes/userRoutes.js';
import adminRoutes from './modules/admin/routes/adminRoutes.js';
import offerRoutes from './modules/marketing/routes/offerRoutes.js';
import walletRoutes from './modules/user/routes/walletRoutes.js';
import infoRoutes from './modules/marketing/routes/infoRoutes.js';
import contactRoutes from './modules/marketing/routes/contactRoutes.js';
import propertyRoutes from './modules/hotel/routes/propertyRoutes.js';
import bookingRoutes from './modules/hotel/routes/bookingRoutes.js';
import reviewRoutes from './modules/hotel/routes/reviewRoutes.js';
import paymentRoutes from './modules/payment/routes/paymentRoutes.js';
import availabilityRoutes from './modules/hotel/routes/availabilityRoutes.js';
import hotelRoutes from './modules/hotel/routes/hotelRoutes.js';
import referralRoutes from './modules/referral/routes/referralRoutes.js';
import faqRoutes from './modules/marketing/routes/faqRoutes.js';
import partnerRoutes from './modules/partner/routes/partnerRoutes.js';
import blogRoutes from './modules/marketing/routes/blogRoutes.js';
import { taxiRouter } from './modules/taxi/routes/index.js';
import { configureTaxiSocketServer } from './modules/taxi/socket/index.js';
import { restoreScheduledDispatches } from './modules/taxi/services/dispatchService.js';
import weddingRoutes from './modules/wedding/routes/weddingRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/info', infoRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/taxi', taxiRouter);
app.use('/api/v1', taxiRouter);
app.use('/api/wedding', weddingRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Global Error Handler:', err);
  const statusCode = Number(err?.statusCode || err?.status || 500);
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    details: err.details || undefined,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});


// Basic Route
app.get('/', (req, res) => {
  res.send({ message: 'Rukkoin API is running successfully' });
});

// MongoDB Connection Options with retry logic
const mongoOptions = {
  serverSelectionTimeoutMS: 10000, // Timeout after 10s instead of 30s
  socketTimeoutMS: 45000,
  family: 4, // Use IPv4, skip trying IPv6
  maxPoolSize: 10,
  minPoolSize: 2,
  retryWrites: true,
  retryReads: true,
};

// Database Connection with Retry Logic
const connectWithRetry = async (retries = 5, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const maskedUri = process.env.MONGODB_URL?.replace(/:([^@]+)@/, ':****@');
      console.log(`🔄 Attempting MongoDB connection... (Attempt ${i + 1}/${retries})`);
      console.log(`📍 Connecting to: ${maskedUri}`);

      await mongoose.connect(
        process.env.MONGODB_URL,
        mongoOptions
      );

      console.log('✅ MongoDB connected successfully');

      // Debug: Check Admin counts
      const adminCount = await mongoose.connection.db.collection('admins').countDocuments();
      const userCount = await mongoose.connection.db.collection('users').countDocuments();
      console.log(`📊 DB Status - Admins: ${adminCount}, Users: ${userCount}`);

      // Start server only after successful DB connection
      server.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
      });

      await restoreScheduledDispatches();
      return; // Exit function on success
    } catch (err) {
      console.error(`❌ MongoDB connection attempt ${i + 1} failed:`, err.message);

      if (i < retries - 1) {
        console.log(`⏳ Retrying in ${delay / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error('❌ All MongoDB connection attempts failed. Please check:');
        console.error('   1. Your internet connection');
        console.error('   2. MongoDB Atlas IP whitelist (add 0.0.0.0/0 for testing)');
        console.error('   3. Your firewall/antivirus settings');
        console.error('   4. DNS settings (try flushing DNS: ipconfig /flushdns)');
        process.exit(1);
      }
    }
  }
};

// Handle MongoDB connection events
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err.message);
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected successfully');
});

// Start connection
connectWithRetry();
