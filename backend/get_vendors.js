import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/rukkooin')
  .then(async () => {
    const WeddingVendor = (await import('./modules/wedding/models/WeddingVendor.js')).default;
    const vendors = await WeddingVendor.find({});
    console.log(JSON.stringify(vendors, null, 2));
    process.exit(0);
  });
