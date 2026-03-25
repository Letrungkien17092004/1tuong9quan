import { Router } from "express";
import { PlayerController } from "../controllers/index.js";
import { CreatePlayerUsecase } from "../../core/usecases/index.js";
import { playerRepo } from "../../containers.js";

const playerRouter = Router()

const createPlayerUsecase = new CreatePlayerUsecase(playerRepo)
const playerController = new PlayerController(createPlayerUsecase)

playerRouter.post("/", playerController.create)

export default playerRouter