import { HotelResponse } from "../models/hotelCollection";

export type PaperfliersResponse = {
  hotel_id: string;
  destination_id: number;
  hotel_name: string;
  location: {
    address: string;
    country: string;
  };
  details: string;
  amenities: {
    general: string[];
    room: string[];
  };
  images: {
    rooms: { link: string; caption: string }[];
    site: { link: string; caption: string }[];
  };
  booking_conditions: string[];
};

function parser(item: PaperfliersResponse): HotelResponse {
  return {
    id: item["hotel_id"],
    destination_id: item["destination_id"],
    name: item["hotel_name"],
    location: {
      lat: 0,
      lng: 0,
      address: item["location"]["address"] || "",
      city: "",
      country: item["location"]["country"],
    },
    description: item["details"],
    amenities: {
      general: item["amenities"]["general"] || [],
      room: item["amenities"]["room"] || [],
    },
    images: {
      room: item["images"]["rooms"].map((r) => {
        return {
          link: r.link,
          description: r.caption,
        };
      }),
      site: item["images"]["site"].map((r) => {
        return {
          link: r.link,
          description: r.caption,
        };
      }),
      amenities: [],
    },
    booking_conditions: item["booking_conditions"],
  };
}

export async function paperfliersFetcher(
  url: string,
): Promise<HotelResponse[]> {
  const hotelList: HotelResponse[] = [];

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = (await response.json()) as PaperfliersResponse[];
    data.forEach((item) => {
      const hotel = parser(item);
      hotelList.push(hotel);
    });
  } catch (error) {
    console.log("Error fetching data: ", error);
  }

  return hotelList;
}
