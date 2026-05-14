import mongoose from 'mongoose';
import WeddingVendor from './modules/wedding/models/WeddingVendor.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mydestination';

const checkVendors = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    const vendors = await WeddingVendor.find({});
    console.log('VENDORS_DATA_START');
    console.log(JSON.stringify(vendors, null, 2));
    console.log('VENDORS_DATA_END');
    await mongoose.disconnect();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

checkVendors();
