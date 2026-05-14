import mongoose from 'mongoose';
import WeddingCategory from './modules/wedding/models/WeddingCategory.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mydestination';

const seedCategory = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const categoryName = 'Venue Manager';
    const slug = 'venue-manager';

    const existing = await WeddingCategory.findOne({ slug });
    if (existing) {
      console.log('Category already exists');
    } else {
      await WeddingCategory.create({
        name: categoryName,
        slug: slug,
        description: 'Manage and oversee wedding venue operations',
        type: 'primary',
        status: 'active'
      });
      console.log('Category "Venue Manager" added successfully');
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding category:', error);
    process.exit(1);
  }
};

seedCategory();
