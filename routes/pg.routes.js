// routes/pg.routes.js

import express from "express";
import { createPG, getAllPGs } from "../controllers/pg.controller.js";
import { protect } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

const router = express.Router();

// Public: students can browse PGs
router.get("/", getAllPGs);

// Protected: only providers can create PGs
router.post(
  "/",
  protect,
  requireRole("provider"),
  createPG
);

export default router;
