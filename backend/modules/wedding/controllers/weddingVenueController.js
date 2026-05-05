import WeddingVenue from '../models/WeddingVenue.js';

export const getVenues = async (req, res) => {
  try {
    const { destinationId } = req.query;
    const filter = { status: 'approved' };
    if (destinationId) filter.destination = destinationId;
    
    const venues = await WeddingVenue.find(filter)
      .populate('destination', 'name location')
      .sort({ createdAt: -1 });
    res.status(200).json(venues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getVenueDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const venue = await WeddingVenue.findById(id)
      .populate('destination', 'name location image')
      .populate('vendor', 'name email phone avatar');
    
    if (!venue) return res.status(404).json({ message: 'Venue not found' });
    
    res.status(200).json(venue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminVenues = async (req, res) => {
  try {
    const venues = await WeddingVenue.find()
      .populate('destination', 'name location')
      .populate('vendor', 'name email phone')
      .sort({ createdAt: -1 });
    res.status(200).json(venues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateVenueStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const item = await WeddingVenue.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true }
    );

    if (!item) return res.status(404).json({ message: 'Venue not found' });
    
    res.status(200).json({ success: true, item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
