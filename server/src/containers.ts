// this file for create instant of repositories
import { PlayerRepository, GameManagerRepository } from "./repositories/index.js";

const playerRepo = new PlayerRepository()
const gameManagerRepo = new GameManagerRepository()

export {
    playerRepo,
    gameManagerRepo
}
