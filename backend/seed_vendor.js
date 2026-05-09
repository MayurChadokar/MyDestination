import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/rukkooin')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Load models dynamically to avoid issues
const seedVendor = async () => {
  try {
    const User = (await import('./modules/user/models/User.js')).default;
    const WeddingVendor = (await import('./modules/wedding/models/WeddingVendor.js')).default;

    const email = 'hero@mydestination.com';
    const password = 'password123';
    const phone = '9876543210';

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        console.log("User already exists. Making sure it is approved and password is correct.");
        existingUser.partnerApprovalStatus = 'approved';
        existingUser.password = await bcrypt.hash(password, 10);
        await existingUser.save();
        
        let vendor = await WeddingVendor.findOne({ user: existingUser._id });
        if(vendor) {
            vendor.status = 'active';
            await vendor.save();
        }
        console.log('Credentials:');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: 'Hero Vendor',
      email: email,
      phone: phone,
      password: hashedPassword,
      role: 'vendor',
      partnerApprovalStatus: 'approved',
      isVerified: true,
      category: 'Photography',
      location: 'Goa',
      experience: 5,
    });

    await WeddingVendor.create({
      user: user._id,
      name: 'Hero Photography',
      category: 'Photography',
      location: 'Goa',
      experience: 5,
      contactPhone: phone,
      contactEmail: email,
      status: 'active',
      price: { base: 50000, type: 'total' }
    });

    console.log('Vendor seeded successfully!');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedVendor();
