import Listing from "../models/Listing.js";

export const getAllListings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const totalCount = await Listing.count();

    const listings = await Listing.findAll({
      order: [['createdAt', 'ASC']],
      limit,
      offset
    });

    res.json({
      success: true,
      data: listings,
      pagination: {
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        pageSize: limit,
        hasNextPage: page * limit < totalCount,
        hasPreviousPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch listings' 
    });
  }
};