import express from "express";
import cors from "cors";
import initRoutes from "./src/routes/index";
import connectDB from "./src/config/connectDB";
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["POST", "GET", "PUT", "DELETE"],
  })
);

// read data from client

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// test server

initRoutes(app);
connectDB();

const port = process.env.PORT || 8888;
const listner = app.listen(port, () => {
  console.log(`server is running on the port ${listner.address().port}`);
});
