import {
  patagoniaFetcher,
  PatagoniaResponse,
} from "../../src/services/patagoniaFetcher";

const mockPatagoniaResponse: PatagoniaResponse = {
  id: "501",
  destination: 101,
  name: "Patagonia Adventure Lodge",
  lat: -45.9876,
  lng: 72.3456,
  address: "123 Mountain Rd",
  info: "A beautiful lodge in Patagonia surrounded by mountains.",
  amenities: ["Free WiFi", "Hot Tub", "Hiking Trails"],
  images: {
    rooms: [
      {
        url: "https://example.com/room1.jpg",
        description: "Mountain View Room",
      },
      { url: "https://example.com/room2.jpg", description: "Deluxe Suite" },
    ],
    amenities: [
      { url: "https://example.com/pool.jpg", description: "Heated Pool" },
      { url: "https://example.com/gym.jpg", description: "Modern Gym" },
    ],
  },
};

describe("patagoniaFetcher function", () => {
  const mockUrl = "https://api.example.com/patagonia";

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should fetch and parse data correctly", async () => {
    const mockData: PatagoniaResponse[] = [mockPatagoniaResponse];
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const result = await patagoniaFetcher(mockUrl);

    expect(fetch).toHaveBeenCalledWith(mockUrl);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("501");
    expect(result[0].name).toBe("Patagonia Adventure Lodge");
  });

  it("should log an error if fetching fails", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    (fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

    const result = await patagoniaFetcher(mockUrl);

    expect(consoleSpy).toHaveBeenCalledWith(
      "Error fetching data: ",
      new Error("Network error"),
    );
    expect(result).toEqual([]);

    consoleSpy.mockRestore();
  });
});
