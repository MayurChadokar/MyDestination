import mongoose from 'mongoose';
import WeddingDestination from './backend/modules/wedding/models/WeddingDestination.js';
import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });

const updateSlugs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mydestination');
    const dests = await WeddingDestination.find();
    for (const d of dests) {
      if (!d.slug) {
        d.slug = d.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        await d.save();
        console.log(`Updated slug for: ${d.name} -> ${d.slug}`);
      }
    }
    console.log('All slugs updated.');
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.connection.close();
  }
};

updateSlugs();
