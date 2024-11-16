import request from "supertest";
import app from "../../src/app";

describe("GET /list", () => {
  it("should return an error for invalid parameters", async () => {
    const response = await request(app).get(
      "/list?invalid_wrong_parameter=test",
    );
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  // Placeholder test.
  it("should return a success response with valid parameters", async () => {
    const response = await request(app).get("/list?destination=123");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("destination", "123");
  });
});
