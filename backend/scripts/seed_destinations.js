import mongoose from 'mongoose';
import WeddingDestination from '../modules/wedding/models/WeddingDestination.js';
import dotenv from 'dotenv';
dotenv.config();

const destinations = [
  { name: 'Goa', slug: 'goa', category: 'Beach', description: 'Sun, Sand and Wed-lock!', startingPrice: 500000 },
  { name: 'Jaipur', slug: 'jaipur', category: 'Heritage', description: 'Royal Weddings in the Pink City', startingPrice: 800000 },
  { name: 'Udaipur', slug: 'udaipur', category: 'Heritage', description: 'The City of Lakes', startingPrice: 1000000 },
  { name: 'Shimla', slug: 'shimla', category: 'Hill', description: 'Mountains and Vows', startingPrice: 400000 },
  { name: 'Kerala', slug: 'kerala', category: 'Beach', description: 'Gods Own Country', startingPrice: 600000 }
];

const seedDestinations = async () => {
  try {
    const mongoUri = process.env.MONGODB_URL;
    if (!mongoUri) throw new Error('MONGODB_URL is not defined in .env');

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    for (const dest of destinations) {
      await WeddingDestination.findOneAndUpdate(
        { slug: dest.slug },
        dest,
        { upsert: true, new: true }
      );
      console.log(`Added/Updated: ${dest.name}`);
    }

    console.log('✅ Destinations seeded successfully!');
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seedDestinations();
