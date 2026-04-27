import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import 'dotenv/config';

const createTestUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to MongoDB');

    const phone = '1234567890';
    const name = 'Test User';
    const email = 'testuser@rukkoo.in';

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      console.log('User already exists.');
    } else {
      const passwordHash = await bcrypt.hash('123456', 10);
      const newUser = new User({
        name,
        email,
        phone,
        password: passwordHash,
        role: 'user',
        isVerified: true
      });
      await newUser.save();
      console.log('New test user created successfully');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error creating user:', error);
    process.exit(1);
  }
};

createTestUser();
