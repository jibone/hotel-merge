import { HotelResponse } from "../models/hotelCollection";

export type PatagoniaResponse = {
  id: string;
  destination: number;
  name: string;
  lat: number;
  lng: number;
  address: string;
  info: string;
  amenities: string[];
  images: {
    rooms: { url: string; description: string }[];
    amenities: { url: string; description: string }[];
  };
};

function parser(item: PatagoniaResponse): HotelResponse {
  return {
    id: item["id"],
    destination_id: item["destination"],
    name: item["name"],
    location: {
      lat: item["lat"] || 0,
      lng: item["lng"] || 0,
      address: item["address"] || "",
      city: "",
      country: "",
    },
    description: item["info"] || "",
    amenities: {
      general: [],
      room: item["amenities"] || [],
    },
    images: {
      room: item["images"]["rooms"].map((r) => {
        return {
          link: r.url,
          description: r.description,
        };
      }),
      site: [],
      amenities: item["images"]["amenities"].map((r) => {
        return {
          link: r.url,
          description: r.description,
        };
      }),
    },
    booking_conditions: [],
  };
}

export async function patagoniaFetcher(url: string): Promise<HotelResponse[]> {
  const hotelList: HotelResponse[] = [];

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = (await response.json()) as PatagoniaResponse[];
    data.forEach((item) => {
      const hotel = parser(item);
      hotelList.push(hotel);
    });
  } catch (error) {
    console.log("Error fetching data: ", error);
  }

  return hotelList;
}
