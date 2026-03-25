import { Router } from "express";
import playerRouter from "./playerRoute.js";

const routers = Router()

routers.use("/api/player", playerRouter)

export default routers