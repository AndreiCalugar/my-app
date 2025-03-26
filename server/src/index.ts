// src/index.ts

// **First**, import and configure dotenv
import dotenv from "dotenv";
dotenv.config();

// Log at the very beginning
console.log("Starting server...");

// **Then**, import other modules
import express from "express";
import cors from "cors";

// Import routes after configuring dotenv
import recommendationsRouter from "./routes/recommendations";

// Rest of your code
const app = express();
const PORT = process.env.PORT || 3001;

console.log(`Port configured as: ${PORT}`);

// Simpler CORS configuration
app.use(cors());
console.log("CORS middleware added");

app.use(express.json());
console.log("JSON middleware added");

// Add a test endpoint at the root
app.get("/", (req, res) => {
  console.log("Root endpoint accessed");
  res.send("Server is running!");
});

// Add a test endpoint
app.get("/test", (req, res) => {
  console.log("Test endpoint accessed");
  res.json({ message: "Server is working!" });
});

app.use("/api/recommendations", recommendationsRouter);
console.log("Routes registered");

console.log("Environment variables loaded:", {
  port: process.env.PORT,
  openaiKey: process.env.OPENAI_API_KEY ? "Set" : "Not set",
  unsplashKey: process.env.UNSPLASH_ACCESS_KEY ? "Set" : "Not set",
  amadeusId: process.env.AMADEUS_CLIENT_ID ? "Set" : "Not set",
  amadeusSecret: process.env.AMADEUS_CLIENT_SECRET ? "Set" : "Not set",
});

// Wrap server start in try/catch
try {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
} catch (error) {
  console.error("Failed to start server:", error);
}
