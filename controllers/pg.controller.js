import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

const createPG = async (req, res, next) => {
  try {
    const { name, address, city, owner_id, total_rooms } = req.body;

    if (!name || !address || !city || !owner_id) {
      console.log("no data filled");
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    let pg_id = "pg_" + uuidv4();
    let query = `INSERT INTO pgs (id,name,address,city,owner_id,total_rooms) VALUES ($1,$2,$3,$4,$5,$6)`;

    const values = [pg_id, name, address, city, owner_id, total_rooms || 0];

    await pool.query(query, values);

    console.log("PG is Created");

    return res.status(201).json({
      success: true,
      data: { pg_id },
      message: "PG created successfully",
    });

    
  } catch (error) {
    next(error);
  }
};

const getAllPGs = async (req, res, next) => {
  try {

    const {city} = req.query;
    
    let query = "select * from pgs ";

    if (city) {
      query +="where city = $1";
      
    }

    const result = await pool.query(query,[city]);

    console.log("PG list fetched");
    console.log(result.rows);

    return res.status(201).json({
      success: true,
      data: result.rows,
      message: "PG list fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};

export { createPG, getAllPGs };
