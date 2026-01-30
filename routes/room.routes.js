import express from "express";
import {createRoom,getRoomsByPG} from "../controllers/room.controller.js";

const router = express.Router();

router.post("/",createRoom);
router.get("/by-pg",getRoomsByPG);


export default router;