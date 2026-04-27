import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Partner from './models/Partner.js';
import 'dotenv/config';

const createPartner = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to MongoDB');

    const phone = '8817921168';
    const name = 'Test Partner';
    const email = 'testpartner@rukkoo.in';

    const existingPartner = await Partner.findOne({ phone });
    if (existingPartner) {
      console.log('Partner already exists.');
      if (existingPartner.isDeleted) {
          existingPartner.isDeleted = false;
          await existingPartner.save();
          console.log('Partner re-activated.');
      }
    } else {
      const passwordHash = await bcrypt.hash('123456', 10);
      const newPartner = new Partner({
        name,
        email,
        phone,
        password: passwordHash,
        role: 'partner',
        isPartner: true,
        partnerApprovalStatus: 'approved',
        isVerified: true
      });
      await newPartner.save();
      console.log('New partner created successfully');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error creating partner:', error);
    process.exit(1);
  }
};

createPartner();
