import express from "express";
import { createPG, getAllPGs } from "../controllers/pg.controller.js";
import { protect } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";
const router = express.Router();

router.post("/", protect, requireRole("provider"), createPG);
router.get("/", protect, requireRole("student"), getAllPGs);

export default router;
