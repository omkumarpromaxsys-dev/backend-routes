import express from "express";
import { createRoom, getRoomsByPG } from "../controllers/room.controller.js";
import { protect } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

const router = express.Router();

router.get("/by-pg",protect, getRoomsByPG);

router.post(
  "/",
  protect,
  requireRole("provider"),
  createRoom
);

export default router;
