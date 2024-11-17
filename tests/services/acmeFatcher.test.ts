import { acmeFetcher } from "../../src/services/acmeFetcher";
import { AcmeResponse } from "../../src/services/acmeFetcher";

const mockAcmeResponse = {
  Id: "123",
  DestinationId: 456,
  Name: "Sample Hotel",
  Latitude: 3.1415,
  Longitude: 101.6869,
  Address: "123 Main St",
  City: "Kuala Lumpur",
  Country: "Malaysia",
  PostalCode: "50000",
  Description: "A cozy hotel in the city center",
  Facilities: ["Free WiFi", "Swimming Pool"],
};

describe("acmeFetcher function", () => {
  const mockUrl = "https://api.example.com/hotels";

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should fetch and parse data correctly", async () => {
    const mockData: AcmeResponse[] = [mockAcmeResponse];
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const result = await acmeFetcher(mockUrl);

    expect(fetch).toHaveBeenCalledWith(mockUrl);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("123");
    expect(result[0].name).toBe("Sample Hotel");
  });

  it("should handle fetch errors gracefully", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
    });

    const result = await acmeFetcher(mockUrl);

    expect(fetch).toHaveBeenCalledWith(mockUrl);
    expect(consoleSpy).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it("should log an error if fetching fails", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    (fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

    const result = await acmeFetcher(mockUrl);

    expect(consoleSpy).toHaveBeenCalledWith(
      "Error fetching data: ",
      new Error("Network error"),
    );
    expect(result).toEqual([]);

    consoleSpy.mockRestore();
  });
});
