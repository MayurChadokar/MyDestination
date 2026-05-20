import mongoose from 'mongoose';
import WeddingCategory from '../modules/wedding/models/WeddingCategory.js';
import dotenv from 'dotenv';
dotenv.config();

const categories = [
  { name: 'Photographers', slug: 'photographers', description: 'Wedding Photography' },
  { name: 'Venues', slug: 'venues', description: 'Wedding Venues & Hotels' },
  { name: 'Bridal Wear', slug: 'bridal-wear', description: 'Lehengas & Sarees' },
  { name: 'Makeup Artists', slug: 'makeup-artists', description: 'Bridal Makeup' },
  { name: 'Catering', slug: 'catering', description: 'Food & Catering Services' }
];

const seedCategories = async () => {
  try {
    const mongoUri = process.env.MONGODB_URL;
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    for (const cat of categories) {
      await WeddingCategory.findOneAndUpdate(
        { slug: cat.slug },
        cat,
        { upsert: true, new: true }
      );
      console.log(`Added/Updated Category: ${cat.name}`);
    }

    console.log('✅ Categories seeded successfully!');
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seedCategories();
