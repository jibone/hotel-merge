import {
  HotelCollection,
  HotelResponse,
} from "../../src/models/hotelCollection";
import { acmeFetcher } from "../../src/services/acmeFetcher";
import { patagoniaFetcher } from "../../src/services/patagoniaFetcher";
import { paperfliersFetcher } from "../../src/services/paperfliesFetcher";
import { hotelMergerService } from "../../src/services/hotelMerger";

jest.mock("../../src/services/acmeFetcher");
jest.mock("../../src/services/patagoniaFetcher");
jest.mock("../../src/services/paperfliesFetcher");
jest.mock("../../src/services/hotelMerger");

const mockHotelList: HotelResponse[] = [
  {
    id: "1",
    destination_id: 101,
    name: "Acme Hotel",
    location: {
      lat: 10.1234,
      lng: 20.5678,
      address: "123 Acme St",
      city: "Acme City",
      country: "Acme Land",
    },
    description: "A great hotel by Acme",
    amenities: {
      general: ["WiFi", "Pool"],
      room: ["Air Conditioning", "TV"],
    },
    images: {
      room: [
        { link: "https://example.com/room.jpg", description: "Room View" },
      ],
      site: [],
      amenities: [],
    },
    booking_conditions: ["No pets", "Check-in after 2 PM"],
  },
  {
    id: "2",
    destination_id: 102,
    name: "Patagonia Lodge",
    location: {
      lat: -33.4567,
      lng: 70.6789,
      address: "456 Patagonia Rd",
      city: "Patagonia City",
      country: "Patagonia",
    },
    description: "Scenic views at Patagonia Lodge",
    amenities: {
      general: ["Free Breakfast", "Gym"],
      room: ["Mini Bar", "Heater"],
    },
    images: {
      room: [],
      site: [
        { link: "https://example.com/site.jpg", description: "Site View" },
      ],
      amenities: [],
    },
    booking_conditions: ["No smoking", "Check-out by 11 AM"],
  },
];

describe("HotelCollection", () => {
  beforeEach(() => {
    // Mock the fetcher functions to return mock data
    (acmeFetcher as jest.Mock).mockResolvedValue([mockHotelList[0]]);
    (patagoniaFetcher as jest.Mock).mockResolvedValue([mockHotelList[1]]);
    (paperfliersFetcher as jest.Mock).mockResolvedValue([]);
    (hotelMergerService as jest.Mock).mockReturnValue(
      new Map(mockHotelList.map((hotel) => [hotel.id, hotel])),
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should initialize with merged data from all suppliers", async () => {
    const collection = await HotelCollection.init();

    const allHotels = collection.allHotels();
    expect(allHotels).toHaveLength(2);
    expect(allHotels).toEqual(expect.arrayContaining(mockHotelList));
  });

  it("should find a hotel by ID", async () => {
    const collection = await HotelCollection.init();

    const hotel = collection.findById("1");
    expect(hotel).toBeDefined();
    expect(hotel?.name).toBe("Acme Hotel");

    const nonExistentHotel = collection.findById("999");
    expect(nonExistentHotel).toBeUndefined();
  });

  it("should find hotels by destination ID", async () => {
    const collection = await HotelCollection.init();

    const hotelsByDestination = collection.findByDestinationId(102);
    expect(hotelsByDestination).toHaveLength(1);
    expect(hotelsByDestination[0].name).toBe("Patagonia Lodge");

    const noHotels = collection.findByDestinationId(999);
    expect(noHotels).toEqual([]);
  });
});
