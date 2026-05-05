import WeddingRealWedding from '../models/WeddingRealWedding.js';
import WeddingGallery from '../models/WeddingGallery.js';
import { uploadToCloudinary } from '../../../utils/cloudinary.js';

export const getGallery = async (req, res) => {
  try {
    const images = await WeddingGallery.find().sort({ createdAt: -1 });
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addGalleryImage = async (req, res) => {
  try {
    const { image, title, category } = req.body;
    
    let imageUrl = '';
    if (image && image.startsWith('data:image')) {
      const uploadResponse = await uploadToCloudinary(image, 'wedding/gallery');
      imageUrl = uploadResponse.secure_url;
    }

    const newImage = await WeddingGallery.create({
      url: imageUrl,
      title,
      category
    });

    res.status(201).json(newImage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteGalleryImage = async (req, res) => {
  try {
    const { id } = req.params;
    await WeddingGallery.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Real Weddings
export const getRealWeddings = async (req, res) => {
  try {
    const weddings = await WeddingRealWedding.find().sort({ createdAt: -1 });
    res.status(200).json(weddings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addRealWedding = async (req, res) => {
  try {
    const { coupleName, date, location, story, coverImage, gallery } = req.body;
    
    let coverImageUrl = '';
    if (coverImage && coverImage.startsWith('data:image')) {
      const uploadResponse = await uploadToCloudinary(coverImage, 'wedding/real-weddings');
      coverImageUrl = uploadResponse.secure_url;
    }

    const uploadedGallery = [];
    if (gallery && Array.isArray(gallery)) {
      for (const img of gallery) {
        if (img.startsWith('data:image')) {
          const uploadRes = await uploadToCloudinary(img, 'wedding/real-weddings/gallery');
          uploadedGallery.push(uploadRes.secure_url);
        } else {
          uploadedGallery.push(img);
        }
      }
    }

    const newWedding = await WeddingRealWedding.create({
      coupleName,
      date,
      location,
      story,
      coverImage: coverImageUrl,
      gallery: uploadedGallery
    });

    res.status(201).json(newWedding);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteRealWedding = async (req, res) => {
  try {
    const { id } = req.params;
    await WeddingRealWedding.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Real wedding story deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
