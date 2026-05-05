import WeddingDestination from '../models/WeddingDestination.js';
import WeddingCategory from '../models/WeddingCategory.js';
import { uploadToCloudinary } from '../../../utils/cloudinary.js';

export const getDestinations = async (req, res) => {
  try {
    const destinations = await WeddingDestination.find({ status: 'active' });
    res.status(200).json(destinations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addDestination = async (req, res) => {
  try {
    const { name, location, category, startingPrice, avgCost, bestSeason, description, image } = req.body;
    
    let imageUrl = image;
    if (image && image.startsWith('data:image')) {
      const uploadResponse = await uploadToCloudinary(image, 'wedding/destinations');
      imageUrl = uploadResponse.secure_url;
    }

    const newDest = await WeddingDestination.create({
      name,
      location,
      category,
      startingPrice,
      avgCost,
      bestSeason,
      description,
      image: imageUrl
    });

    res.status(201).json(newDest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDestination = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.image && updates.image.startsWith('data:image')) {
      const uploadResponse = await uploadToCloudinary(updates.image, 'wedding/destinations');
      updates.image = uploadResponse.secure_url;
    }

    const updated = await WeddingDestination.findByIdAndUpdate(id, updates, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDestination = async (req, res) => {
  try {
    const { id } = req.params;
    await WeddingDestination.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Destination deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Category Controllers
export const getCategories = async (req, res) => {
  try {
    const items = await WeddingCategory.find({ status: 'active' });
    res.status(200).json({ success: true, categories: items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
