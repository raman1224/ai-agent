import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import router from "./routes/auth.route.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8001;

app.use(express.json());
app.use("/", router);
app.get("/", (req, res) => {
  res.send("Hello, World from auth");
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB()
});