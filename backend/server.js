// Main application entrypoint.
// Sets up middleware, routes, database connection, and error handling.
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import errorHandler from "./middleware/errorHandler.js";
import { apiRateLimiter } from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();

await connectDB();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Apply general API rate limiting to all /api routes.
app.use("/api", apiRateLimiter);

// Mount authentication routes under /api/auth
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Backend Running");
});

// Global error handler should be registered after all routes.
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});