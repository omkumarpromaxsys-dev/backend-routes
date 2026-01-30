import express from "express";
import {createPG,getAllPGs} from "../controllers/pg.controller.js"

const router = express.Router();


router.post("/",createPG);
router.get("/",getAllPGs);

export default router;