import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import errorHandler from "./middleware/errorHandler.js"
import pgRoutes from "./routes/pg.routes.js";
import roomRoutes from "./routes/room.routes.js"
import providerRoutes from "./routes/provider.js";
import adminRoutes from "./routes/admin.js";
import userRoutes from "./routes/user.routes.js";


dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/provider", providerRoutes);
app.use("/api/admin", adminRoutes);



app.use("/api/profile",userRoutes);

app.use("/pg",pgRoutes);
app.use("/rooms",roomRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
