import request from "supertest";
import app from "../../src/app";
import { HotelResponse } from "../../src/models/hotelCollection";

import { acmeFetcher } from "../../src/services/acmeFetcher";
import { patagoniaFetcher } from "../../src/services/patagoniaFetcher";
import { paperfliersFetcher } from "../../src/services/paperfliesFetcher";
import { hotelMergerService } from "../../src/services/hotelMerger";

jest.mock("../../src/services/acmeFetcher");
jest.mock("../../src/services/patagoniaFetcher");
jest.mock("../../src/services/paperfliesFetcher");
jest.mock("../../src/services/hotelMerger");

// Mock hotel data for testing
const mockHotelList: HotelResponse[] = [
  {
    id: "1",
    destination_id: 101,
    name: "Hotel A",
    location: {
      lat: 10.123,
      lng: 20.456,
      address: "123 Street",
      city: "City A",
      country: "Country A",
    },
    description: "A description",
    amenities: { general: ["WiFi"], room: ["AC"] },
    images: { room: [], site: [], amenities: [] },
    booking_conditions: [],
  },
  {
    id: "2",
    destination_id: 102,
    name: "Hotel B",
    location: {
      lat: 12.345,
      lng: 23.456,
      address: "456 Avenue",
      city: "City B",
      country: "Country B",
    },
    description: "B description",
    amenities: { general: ["Pool"], room: ["TV"] },
    images: { room: [], site: [], amenities: [] },
    booking_conditions: [],
  },
];

describe("hotelHandler", () => {
  beforeEach(() => {
    (acmeFetcher as jest.Mock).mockResolvedValue([mockHotelList[0]]);
    (patagoniaFetcher as jest.Mock).mockResolvedValue([mockHotelList[1]]);
    (paperfliersFetcher as jest.Mock).mockResolvedValue([]);
    (hotelMergerService as jest.Mock).mockReturnValue(
      new Map(mockHotelList.map((hotel) => [hotel.id, hotel])),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return all hotels if no query parameters are provided", async () => {
    const response = await request(app).get("/list");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body).toEqual(expect.arrayContaining(mockHotelList));
  });

  it("should return hotels by destination ID", async () => {
    const response = await request(app).get("/list?destination=101");

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].name).toBe("Hotel A");
  });

  it("should return hotels by hotel IDs", async () => {
    const response = await request(app).get("/list?hotels[]=1&hotels[]=2");

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(2);
    expect(response.body.data[0].id).toBe("1");
    expect(response.body.data[1].id).toBe("2");
  });

  it("should return 400 for invalid query parameters", async () => {
    const response = await request(app).get("/list?invalidParam=test");

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "Unexpected query parameters: invalidParam",
    );
  });

  it("should return empty array if no hotels match the query", async () => {
    const response = await request(app).get("/list?destination=999");

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual([]);
  });
});
