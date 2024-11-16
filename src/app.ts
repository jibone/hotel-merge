import express from "express";
import { hotelHandler } from "./handlers/hotelHandler";

const app = express();

app.get("/list", (req, res) => {
  hotelHandler(req, res);
});

export default app;
