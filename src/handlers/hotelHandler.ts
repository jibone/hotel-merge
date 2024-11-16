import { Request, Response } from "express";
import { z } from "zod";

const querySchema = z.object({
  destination: z.string().optional(),
  hotel: z.string().optional(),
  hotels: z.array(z.string()).optional(),
});

export const hotelHandler = (req: Request, res: Response) => {
  const parsed = querySchema.safeParse(req.query);

  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid query parameters" });
  }

  const allowedKeys = Object.keys(querySchema.shape);
  const extraKeys = Object.keys(req.query).filter(
    (key) => !allowedKeys.includes(key),
  );

  if (extraKeys.length > 0) {
    return res.status(400).json({
      error: `Unexpected query parameters: ${extraKeys.join(", ")}`,
    });
  }

  const { destination, hotel, hotels } = parsed.data;

  res.json({
    message: "endpoint works!",
    destination,
    hotel,
    hotels,
  });
};
