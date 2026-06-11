// Main application entrypoint.
// Sets up middleware, routes, database connection, and error handling.
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import connectDB from "./config/db.js";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/auth.js";
import contactRoutes from "./routes/contactRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";
import ngoRoutes from "./routes/ngoRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import { startDonationExpiryJob } from "./services/donationExpiryService.js";
// import { apiRateLimiter } from "./middleware/rateLimiter.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

await connectDB();
startDonationExpiryJob();

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Apply general API rate limiting to all /api routes.
// app.use("/api", apiRateLimiter);

// Mount authentication routes under /api/auth
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/ngo", ngoRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
  res.send("Backend Running");
});

// Global error handler should be registered after all routes.
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
