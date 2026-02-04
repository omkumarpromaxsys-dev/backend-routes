// /routes/admin.js

import express from "express";
import { protect } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";
import {
  listPendingProviders,
  approveProvider,
  rejectProvider,
} from "../controllers/adminController.js";

const router = express.Router();

router.get(
  "/providers/pending",
  protect,
  requireRole("admin"),
  listPendingProviders
);

router.post(
  "/providers/:userId/approve",
  protect,
  requireRole("admin"),
  approveProvider
);

router.post(
  "/providers/:userId/reject",
  protect,
  requireRole("admin"),
  rejectProvider
);

export default router;
