import "dotenv/config";
import express from "express";
import { connectDB } from "./config/db.js";
import router from "./routes/agent.route.js";

const app = express();
const PORT = process.env.PORT || 8003;

app.use(express.json());
app.use("/", router)
app.get("/", (req, res) => {
  res.send("Hello, World! from agent");
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB()
});