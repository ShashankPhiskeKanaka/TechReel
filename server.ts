import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { connectPrisma } from "./db/prisma.js";
dotenv.config();

const app = express();

const corsOptions = {
  // Allows any origin while still supporting credentials/cookies
  origin: "*",
  methods: 'GET,POST,PUT,PATCH,DELETE',
  credentials: true,
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

connectPrisma();

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.listen(process.env.PORT, () => {
    console.log(`App running on port : ${process.env.PORT}`);
});