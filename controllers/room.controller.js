import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";


const createRoom = async (req,res,next)=>{
    try {
        const {pg_id,room_number ,type , price} = req.body;

    if (!pg_id || !room_number || !type || !price) {
        return res.status(400).json({
            success : false,
            message : "Missing required fields"
        });
    }

    let query = "INSERT INTO rooms (id, pg_id, room_number, type, price) VALUES ($1,$2,$3,$4,$5)";
    let room_id = "room"+uuidv4();
    let values = [room_id, pg_id, room_number, type, price]

    const result = await pool.query(query,values);

    return res.status(201).json({
        success: true,
      data: { room_id },
      message: "room created successfully",
    });
    } catch (error) {
        next(error);
    }
    
}

const getRoomsByPG = async (req, res, next) => {
  try {
    const { pg_id } = req.query;

    if (!pg_id) {
      return res.status(400).json({
        success: false,
        message: "pg_id required"
      });
    }

    const result = await pool.query(
      "SELECT * FROM rooms WHERE pg_id = $1",
      [pg_id]
    );

    return res.json({
      success: true,
      data: result.rows,
      message: "Rooms fetched successfully"
    });

  } catch (error) {
    next(error);
  }
};


export {createRoom,getRoomsByPG};