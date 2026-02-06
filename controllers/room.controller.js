import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

export const createRoom = async (req, res, next) => {
  try {
    const { pg_id, room_number, type, price } = req.body;

    if (!pg_id || !room_number || !type || !price) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const pgResult = await pool.query(
      `
      SELECT owner_id
      FROM pgs
      WHERE id = $1
      `,
      [pg_id]
    );

    if (pgResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "PG not found",
      });
    }

    const pgOwnerId = pgResult.rows[0].owner_id;

    if (pgOwnerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to add rooms to this PG",
      });
    }

    const room_id = "room_" + uuidv4();

    const insertQuery = `
      INSERT INTO rooms (id, pg_id, room_number, type, price)
      VALUES ($1, $2, $3, $4, $5)
    `;

    const values = [room_id, pg_id, room_number, type, price];

    await pool.query(insertQuery, values);

    return res.status(201).json({
      success: true,
      data: { room_id },
      message: "Room created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getRoomsByPG = async (req, res, next) => {
  try {
    const { pg_id } = req.query;

    if (!pg_id) {
      return res.status(400).json({
        success: false,
        message: "pg_id is required",
      });
    }

    const result = await pool.query(
      `
      SELECT *
      FROM rooms
      WHERE pg_id = $1
      `,
      [pg_id]
    );

    return res.json({
      success: true,
      data: result.rows,
      message: "Rooms fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};
