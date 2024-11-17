import { HotelResponse } from "../models/hotelCollection";

export type AcmeResponse = {
  Id: string;
  DestinationId: number;
  Name: string;
  Latitude: number;
  Longitude: number;
  Address: string;
  City: string;
  Country: string;
  PostalCode: string;
  Description: string;
  Facilities: string[];
};

function parser(item: AcmeResponse): HotelResponse {
  return {
    id: item["Id"],
    destination_id: item["DestinationId"],
    name: item["Name"],
    location: {
      lat: item["Latitude"] || 0,
      lng: item["Longitude"] || 0,
      address: item["Address"],
      city: item["City"],
      country: item["Country"],
    },
    description: item["Description"] || "",
    amenities: {
      general: [],
      room: [],
    },
    images: {
      room: [],
      site: [],
      amenities: [],
    },
    booking_conditions: [],
  };
}

export async function acmeFetcher(url: string): Promise<HotelResponse[]> {
  const hotelList: HotelResponse[] = [];

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = (await response.json()) as AcmeResponse[];
    data.forEach((item) => {
      const hotel = parser(item);
      hotelList.push(hotel);
    });
  } catch (error) {
    console.log("Error fetching data: ", error);
  }

  return hotelList;
}
