import mongoose from 'mongoose';
import dotenv from 'dotenv';
import WeddingCategory from './modules/wedding/models/WeddingCategory.js';

dotenv.config();

const categories = [
  { 
    name: 'Venues', 
    slug: 'venues', 
    description: 'Marriage halls, lawns, and resorts', 
    icon: '🏰', 
    type: 'primary',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1000&auto=format&fit=crop',
    bgColor: '#E5F0E5',
    textColor: '#2D5A2D'
  },
  { 
    name: 'Photographers', 
    slug: 'photographers', 
    description: 'Candid and traditional photography', 
    icon: '📸', 
    type: 'primary',
    image: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=1000&auto=format&fit=crop',
    bgColor: '#EBE5F5',
    textColor: '#3D2B6B'
  },
  { 
    name: 'Bridal Makeup', 
    slug: 'bridal-makeup', 
    description: 'Makeup artists and hair stylists', 
    icon: '💄', 
    type: 'primary',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1000&auto=format&fit=crop',
    bgColor: '#F5E0DC',
    textColor: '#7B2D2D'
  },
  { 
    name: 'Planning & Decor', 
    slug: 'planning-decor', 
    description: 'Wedding planners and decorators', 
    icon: '🎊', 
    type: 'primary',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000&auto=format&fit=crop',
    bgColor: '#F5E2D0',
    textColor: '#7B4020'
  },
  { 
    name: 'Choreographers', 
    slug: 'choreographers', 
    description: 'Dance trainers for sangeet', 
    icon: '💃', 
    type: 'primary',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1000&auto=format&fit=crop',
    bgColor: '#FFF5EB',
    textColor: '#8C4820'
  },
  { 
    name: 'Wedding Cards', 
    slug: 'wedding-cards', 
    description: 'Invitations and stationery', 
    icon: '✉️', 
    type: 'primary',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1000&auto=format&fit=crop',
    bgColor: '#FCE8E8',
    textColor: '#7B2020'
  },
  { 
    name: 'Mehendi Artists', 
    slug: 'mehendi-artists', 
    description: 'Henna and mehendi designs', 
    icon: '✋', 
    type: 'primary',
    image: 'https://images.unsplash.com/photo-1591824438708-ce405f36ba3d?q=80&w=1000&auto=format&fit=crop',
    bgColor: '#F0E8D5',
    textColor: '#5C3D11'
  },
  { 
    name: 'Groom Wear', 
    slug: 'groom-wear', 
    description: 'Sherwanis and suits', 
    icon: '🤵', 
    type: 'primary',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop',
    bgColor: '#E8EAF0',
    textColor: '#2B2D6B'
  },
  { 
    name: 'Catering', 
    slug: 'catering', 
    description: 'Food and beverages', 
    icon: '🍽️', 
    type: 'primary',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1000&auto=format&fit=crop',
    bgColor: '#FFF3E0',
    textColor: '#7B4500'
  }
];

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('✅ Connected to MongoDB');

    // Clear existing categories to start fresh
    await WeddingCategory.deleteMany({});
    console.log('🗑️  Cleared existing categories');

    await WeddingCategory.insertMany(categories);
    console.log('✨ Seeded categories successfully with cover photos and themes!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    process.exit(1);
  }
};

seedCategories();
