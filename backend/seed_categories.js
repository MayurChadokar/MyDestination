import mongoose from 'mongoose';
import dotenv from 'dotenv';
import WeddingCategory from './modules/wedding/models/WeddingCategory.js';

dotenv.config();

const categories = [
  { name: 'Venues', slug: 'venues', description: 'Marriage halls, lawns, and resorts', icon: '🏰', type: 'primary' },
  { name: 'Photographers', slug: 'photographers', description: 'Candid and traditional photography', icon: '📸', type: 'primary' },
  { name: 'Bridal Makeup', slug: 'bridal-makeup', description: 'Makeup artists and hair stylists', icon: '💄', type: 'primary' },
  { name: 'Planning & Decor', slug: 'planning-decor', description: 'Wedding planners and decorators', icon: '🎊', type: 'primary' },
  { name: 'Choreographers', slug: 'choreographers', description: 'Dance trainers for sangeet', icon: '💃', type: 'primary' },
  { name: 'Wedding Cards', slug: 'wedding-cards', description: 'Invitations and stationery', icon: '✉️', type: 'primary' },
  { name: 'Mehendi Artists', slug: 'mehendi-artists', description: 'Henna and mehendi designs', icon: '✋', type: 'primary' },
  { name: 'Groom Wear', slug: 'groom-wear', description: 'Sherwanis and suits', icon: '🤵', type: 'primary' },
  { name: 'Catering', slug: 'catering', description: 'Food and beverages', icon: '🍽️', type: 'primary' }
];

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('✅ Connected to MongoDB');

    // Clear existing categories to start fresh
    await WeddingCategory.deleteMany({});
    console.log('🗑️  Cleared existing categories');

    await WeddingCategory.insertMany(categories);
    console.log('✨ Seeded categories successfully');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    process.exit(1);
  }
};

seedCategories();
