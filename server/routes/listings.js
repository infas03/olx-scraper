import express from "express";
import { getAllListings } from "../controller/listings.js";

const router = express.Router();

router.get("/", getAllListings);

export default router;
