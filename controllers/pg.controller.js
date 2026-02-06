import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

export const createPG = async (req, res, next) => {
  try {
    const { name, address, city, total_rooms } = req.body;

    if (!name || !address || !city) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const providerProfile = await pool.query(
      `
      SELECT status
      FROM provider_profiles
      WHERE user_id = $1
      `,
      [req.user.id]
    );

    if (providerProfile.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Provider profile not found",
      });
    }

    if (providerProfile.rows[0].status !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Provider not approved yet",
      });
    }

    const pg_id = "pg_" + uuidv4();

    const query = `
      INSERT INTO pgs (id, name, address, city, owner_id, total_rooms)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;

    const values = [pg_id, name, address, city, req.user.id, total_rooms || 0,];

    await pool.query(query, values);

    return res.status(201).json({
      success: true,
      data: { pg_id },
      message: "PG created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getAllPGs = async (req, res, next) => {
  try {
    const { city } = req.query;

    let result;

    if (city) {
      result = await pool.query(
        "SELECT * FROM pgs WHERE city = $1",
        [city]
      );
    } else {
      result = await pool.query(
        "SELECT * FROM pgs"
      );
    }

    return res.json({
      success: true,
      data: result.rows,
      message: "PG list fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};
