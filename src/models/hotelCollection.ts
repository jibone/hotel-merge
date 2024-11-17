import { acmeFetcher } from "../services/acmeFetcher";
import { hotelMergerService } from "../services/hotelMerger";
import { paperfliersFetcher } from "../services/paperfliesFetcher";
import { patagoniaFetcher } from "../services/patagoniaFetcher";

const DATA_SUPPLIERS = [
  {
    url: "https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/acme",
    fetcher: acmeFetcher,
  },
  {
    url: "https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/patagonia",
    fetcher: patagoniaFetcher,
  },
  {
    url: "https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/paperflies",
    fetcher: paperfliersFetcher,
  },
];

type Image = {
  link: string;
  description: string;
};

export type HotelResponse = {
  id: string;
  destination_id: number;
  name: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    city: string;
    country: string;
  };
  description: string;
  amenities: {
    general: string[];
    room: string[];
  };
  images: {
    room: Image[];
    site: Image[];
    amenities: Image[];
  };
  booking_conditions: string[];
};

interface HotellCollectionInterface {
  allHotels(): HotelResponse[];
  findById(hotelId: string): HotelResponse | undefined;
  findByDestinationId(destinationId: number): HotelResponse[];
}

export class HotelCollection implements HotellCollectionInterface {
  private data: Map<string, HotelResponse>;

  private constructor(data: Map<string, HotelResponse>) {
    this.data = data;
  }

  static async init(): Promise<HotelCollection> {
    // const data = await fetchHotelService();
    const hotelList = await Promise.all(
      DATA_SUPPLIERS.map(({ url, fetcher }) => fetcher(url)),
    ).then((result) => result.flat());
    const mergedHotel = hotelMergerService(hotelList);

    return new HotelCollection(mergedHotel);
  }

  allHotels() {
    return Array.from(this.data.values());
  }

  findById(hotelId: string) {
    return this.data.get(hotelId);
  }

  findByDestinationId(destinationId: number): HotelResponse[] {
    const hotelList = Array.from(this.data.values()).filter(
      (d) => d.destination_id === destinationId,
    );

    return hotelList;
  }
}
