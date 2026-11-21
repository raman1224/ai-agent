import { agent } from "../controllers/agent.controller"
import express from "express"

const router = express.Router()

router.post("/chat", agent)

export default router