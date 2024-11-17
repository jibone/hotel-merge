import { paperfliersFetcher } from "../../src/services/paperfliesFetcher";
import { PaperfliersResponse } from "../../src/services/paperfliesFetcher";

const mockPaperfliersResponse = {
  hotel_id: "101",
  destination_id: 202,
  hotel_name: "Grand Paperfliers Hotel",
  location: {
    address: "456 Market St",
    country: "Singapore",
  },
  details: "A luxury hotel with modern amenities.",
  amenities: {
    general: ["Pool", "Spa", "Gym"],
    room: ["Air Conditioning", "Free WiFi"],
  },
  images: {
    rooms: [
      { link: "https://example.com/room1.jpg", caption: "Deluxe Room" },
      { link: "https://example.com/room2.jpg", caption: "Suite Room" },
    ],
    site: [
      { link: "https://example.com/site1.jpg", caption: "Hotel Front" },
      { link: "https://example.com/site2.jpg", caption: "Lobby" },
    ],
  },
  booking_conditions: ["Non-refundable", "Check-in after 3 PM"],
};

describe("paperfliersFetcher function", () => {
  const mockUrl = "https://api.example.com/paperfliers";

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should fetch and parse data correctly", async () => {
    const mockData: PaperfliersResponse[] = [mockPaperfliersResponse];
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const result = await paperfliersFetcher(mockUrl);

    expect(fetch).toHaveBeenCalledWith(mockUrl);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("101");
    expect(result[0].name).toBe("Grand Paperfliers Hotel");
  });

  it("should log an error if fetching fails", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    (fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

    const result = await paperfliersFetcher(mockUrl);

    expect(consoleSpy).toHaveBeenCalledWith(
      "Error fetching data: ",
      new Error("Network error"),
    );
    expect(result).toEqual([]);

    consoleSpy.mockRestore();
  });
});
