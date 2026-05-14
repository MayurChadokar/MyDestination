import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/rukkooin')
  .then(async () => {
    const User = (await import('./modules/user/models/User.js')).default;
    const vendors = await User.find({ role: 'vendor' }).select('email phone name role');
    console.log(JSON.stringify(vendors, null, 2));
    process.exit(0);
  });
