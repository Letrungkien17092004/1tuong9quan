// this file for create instant of repositories
import {
    PlayerRepository,
    MatchRepository,
    WaitingQueueItemRepository
} from "./repositories/index.js";

const playerRepo = new PlayerRepository()
const matchRepo = new MatchRepository()
const waitingQueueItemRepo = new WaitingQueueItemRepository()

export {
    playerRepo,
    matchRepo,
    waitingQueueItemRepo
}
