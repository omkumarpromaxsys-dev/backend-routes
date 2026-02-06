import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

export const createRoom = async (req, res, next) => {
  try {
    const { room_number, type, price } = req.body;

    if (!room_number || !type || !price) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const result = await pool.query(
      `
  SELECT id
  FROM pgs
  WHERE owner_id = $1
  `,
      [req.user.id],
    );

    const pgId = result.rows[0]?.id;

    const pgResult = await pool.query(
      `
      SELECT owner_id
      FROM pgs
      WHERE id = $1
      `,
      [pgId],
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

    const values = [room_id, pgId, room_number, type, price];

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
    const result = await pool.query(
      `
  SELECT id
  FROM pgs
  WHERE owner_id = $1
  `,
      [req.user.id],
    );

    const pgId = result.rows[0]?.id;
    if (!pgId) {
      return res.status(400).json({
        success: false,
        message: "pg_id is required",
      });
    }

    const roomResult = await pool.query(
      `
      SELECT *
      FROM rooms
      WHERE pg_id = $1
      `,
      [pgId],
    );

    return res.json({
      success: true,
      data: roomResult.rows,
      message: "Rooms fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};
