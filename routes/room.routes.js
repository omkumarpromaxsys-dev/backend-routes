// routes/room.routes.js

import express from "express";
import { createRoom, getRoomsByPG } from "../controllers/room.controller.js";
import { protect } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

const router = express.Router();

// Public: students can view rooms
router.get("/by-pg",protect, getRoomsByPG);

// Protected: only provider (PG owner) can create rooms
router.post(
  "/",
  protect,
  requireRole("provider"),
  createRoom
);

export default router;
