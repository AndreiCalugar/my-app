// src/index.ts

// **First**, import and configure dotenv
import dotenv from "dotenv";
dotenv.config();

// **Then**, import other modules
import express from "express";
import cors from "cors";

// Import routes after configuring dotenv
import recommendationsRouter from "./routes/recommendations";

// Rest of your code
const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use("/api/recommendations", recommendationsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
