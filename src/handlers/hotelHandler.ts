import { Request, Response } from "express";
import { z } from "zod";
import { HotelResponse, HotelCollection } from "../models/hotelCollection";

const querySchema = z.object({
  destination: z.string().optional(),
  hotels: z.array(z.string()).optional(),
});

export const hotelHandler = async (req: Request, res: Response) => {
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

  const { destination, hotels } = parsed.data;

  const collection = await HotelCollection.init();

  // return hotel base on hotel id
  if (destination === undefined && hotels !== undefined && hotels.length > 0) {
    const hotelList: HotelResponse[] = [];
    hotels.forEach((hotel_id) => {
      const hotelData = collection.findById(hotel_id);
      if (hotelData !== undefined) {
        hotelList.push(hotelData);
      }
    });

    return res.json({
      data: hotelList,
    });
  }

  if (destination !== undefined) {
    const hotelList = collection.findByDestinationId(parseInt(destination));
    return res.json({
      data: hotelList,
    });
  }

  res.json(collection.allHotels());
};
