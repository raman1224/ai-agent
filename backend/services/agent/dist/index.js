"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const db_js_1 = require("./config/db.js");
const agent_route_js_1 = __importDefault(require("./routes/agent.route.js"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8003;
app.use(express_1.default.json());
app.use("/", agent_route_js_1.default);
app.get("/", (req, res) => {
    res.send("Hello, World! from agent");
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    (0, db_js_1.connectDB)();
});
