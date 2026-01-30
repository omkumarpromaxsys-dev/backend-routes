// provider.js

import express from "express";
import { protect } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";
import { createListing, applyForProvider, updateProviderProfile, getMyProviderStatus } from "../controllers/providerController.js";

const router = express.Router();

router.post(
  "/listing",
  protect,
  requireRole("provider"),
  createListing
);

router.post(
  "/apply",
  protect,
  requireRole("student"),
  applyForProvider
);

router.get(
  "/status",
  protect,
  requireRole("provider", "student"),
  getMyProviderStatus
);

router.put(
  "/profile",
  protect,
  requireRole("provider"),
  updateProviderProfile
);

export default router;
