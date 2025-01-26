import express, { Request, Response } from "express";
import cors from "cors";
import recommendationsRouter from "./routes/recommendations";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });
console.log("Loaded OpenAI API Key:", process.env.OPENAI_API_KEY);

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/recommendations", recommendationsRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Backend server is running!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
