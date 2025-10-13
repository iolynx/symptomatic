import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
console.log(process.env.GEMINI_API_KEY);
import symptomRoutes from "./routes/symptoms.js";
import { connectDB } from "./db.js";

const app = express();
const PORT = process.env.PORT || 5001;

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

// --- API Routes ---
app.use("/api", symptomRoutes);

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
