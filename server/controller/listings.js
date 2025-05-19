import Listing from "../models/Listing.js";
import { Op } from "sequelize";

export const getAllListings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const searchQuery = req.query.search || "";

const whereClause = searchQuery ? {
      [Op.or]: [
        { title: { [Op.like]: `%${searchQuery}%` }},
        { location: { [Op.like]: `%${searchQuery}%` }}
      ]
    } : {};
    const totalCount = await Listing.count({ where: whereClause });

    const listings = await Listing.findAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
      limit,
      offset,
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
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch listings",
    });
  }
};
