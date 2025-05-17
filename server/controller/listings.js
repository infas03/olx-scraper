import Listing from "../models/Listing.js";

export const getAllListings = async (req, res) => {
  try {
    const listings = await Listing.findAll({ order: [['timestamp', 'DESC']] });
    res.json(listings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
};