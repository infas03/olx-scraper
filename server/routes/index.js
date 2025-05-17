import express from "express";

import listingsRouter from './listings.js';

const router = express.Router();

router.use("/listings", listingsRouter);

export default router;
