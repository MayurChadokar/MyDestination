import mongoose from 'mongoose';
import Admin from './backend/modules/admin/models/Admin.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });

const seedAdmin = async () => {
  try {
    const mongoUri = process.env.MONGODB_URL;
    if (!mongoUri) {
      throw new Error('MONGODB_URL is not defined in .env');
    }

    console.log(`Connecting to: ${mongoUri.replace(/:([^@]+)@/, ':****@')}`);
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    const email = 'admin@mydestination.com';
    const existingAdmin = await Admin.findOne({ email });
    
    if (existingAdmin) {
      console.log('ℹ️ Admin already exists');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);
    await Admin.create({
      name: 'My Destination Admin',
      email,
      phone: '9999999999',
      password: hashedPassword,
      role: 'superadmin',
      isActive: true
    });

    console.log('✅ Admin seeded successfully!');
    console.log('Credentials: admin@mydestination.com / admin123');
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seedAdmin();
