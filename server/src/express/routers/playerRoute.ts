import { Router } from "express";
import { PlayerController } from "../controllers/index.js";
import { CreatePlayerUsecase, FindPlayerByIdUsecase } from "../../core/usecases/index.js";
import { playerRepo } from "../../containers.js";

const playerRouter = Router()

const createPlayerUsecase = new CreatePlayerUsecase(playerRepo)
const findPlayerByIdUsecase = new FindPlayerByIdUsecase(playerRepo)
const playerController = new PlayerController(createPlayerUsecase, findPlayerByIdUsecase)

playerRouter.post("/", playerController.create)
playerRouter.get("/:id", playerController.findById)

export default playerRouter