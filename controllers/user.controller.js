import pool from "../config/db";


const getUser = async(req,res,next)=>{
  res.json(req.user);
}




export {getUser};