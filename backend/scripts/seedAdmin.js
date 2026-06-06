import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { FIXED_SERVICE_CITY } from "../constants/location.js";

dotenv.config();

const requiredEnv = ["MONGO_URI", "ADMIN_EMAIL", "ADMIN_PASSWORD", "ADMIN_PHONE"];

const normalizePakistanPhone = (phone) => {
  const digits = phone.replace(/\D/g, "");

  if (digits.startsWith("92") && digits.length === 12) {
    return `+92 ${digits.slice(2)}`;
  }

  if (digits.length === 10) {
    return `+92 ${digits}`;
  }

  throw new Error("ADMIN_PHONE must be a 10 digit local number or +92 formatted number");
};

const seedAdmin = async () => {
  const missingEnv = requiredEnv.filter((key) => !process.env[key]);

  if (missingEnv.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnv.join(", ")}`);
  }

  await mongoose.connect(process.env.MONGO_URI);

  const email = process.env.ADMIN_EMAIL.trim().toLowerCase();
  const phone = normalizePakistanPhone(process.env.ADMIN_PHONE);
  const address = process.env.ADMIN_ADDRESS || "Admin Office";

  const existingAdmin = await User.findOne({ email });

  if (existingAdmin) {
    if (existingAdmin.role !== "admin") {
      throw new Error(`A non-admin user already exists with email ${email}`);
    }

    console.log(`Admin already exists: ${email}`);
    return;
  }

  const existingPhone = await User.findOne({ phone });

  if (existingPhone) {
    throw new Error(`A user already exists with phone ${phone}`);
  }

  const password = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

  await User.create({
    email,
    password,
    phone,
    role: "admin",
    location: {
      city: FIXED_SERVICE_CITY,
      address,
    },
  });

  console.log(`Admin created: ${email}`);
};

seedAdmin()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
