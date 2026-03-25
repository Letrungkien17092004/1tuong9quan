// this file for create instant of repositories
import {
    PlayerRepository,
    GameManagerRepository,
    MatchRepository,
    WaitingQueueItemRepository
} from "./repositories/index.js";

const playerRepo = new PlayerRepository()
const gameManagerRepo = new GameManagerRepository()
const matchRepo = new MatchRepository()
const waitingQueueItemRepo = new WaitingQueueItemRepository()

export {
    playerRepo,
    gameManagerRepo,
    matchRepo,
    waitingQueueItemRepo
}
