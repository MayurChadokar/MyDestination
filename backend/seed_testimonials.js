import mongoose from 'mongoose';
import WeddingTestimonial from './modules/wedding/models/WeddingTestimonial.js';
import dotenv from 'dotenv';

dotenv.config();

const seedTestimonials = [
  {
    name: "Meera & Arjun",
    location: "Udaipur Palace Wedding",
    text: "The most magical experience of our lives. Everything from the decor to the coordination was flawless.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=400",
    status: "approved",
    featured: true
  },
  {
    name: "Sanya & Rohan",
    location: "Goa Beach Wedding",
    text: "My Destination Wedding team made our dream of a sunset beach wedding come true. Highly recommended!",
    rating: 5,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=400",
    status: "pending",
    featured: false
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB for seeding...");
    
    // Clear existing
    await WeddingTestimonial.deleteMany({});
    
    // Insert new
    await WeddingTestimonial.insertMany(seedTestimonials);
    
    console.log("Testimonials seeded successfully!");
    process.exit();
  } catch (err) {
    console.error("Error seeding testimonials:", err);
    process.exit(1);
  }
};

seedDB();
