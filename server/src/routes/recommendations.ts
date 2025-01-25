import { Router, Request, Response } from "express";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { destinations, travelTime, budget, tripType, activities } = req.body;

  // For now, send back mock recommendations
  const recommendations = [
    {
      destination: "Algarve, Portugal",
      description: "Beautiful beaches and family-friendly resorts.",
    },
    {
      destination: "Costa del Sol, Spain",
      description: "Sunny weather and extensive resorts.",
    },
    {
      destination: "Crete, Greece",
      description: "Stunning beaches and rich history.",
    },
  ];

  res.json(recommendations);
});

export default router;
