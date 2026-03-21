import { IGameManagerRepository } from "../Interface/Repositories/index.js";
import { Player, GameManager } from "../Entities/index.js"

export default class JoinGameUsecase {
    private gameManagerRepo: IGameManagerRepository

    constructor(gameManagerRepo: IGameManagerRepository) {
        this.gameManagerRepo = gameManagerRepo
    }

    excute(playerA: Player, playerB: Player): GameManager {
        const gameManager = this.gameManagerRepo.create(playerA.playerId, playerB.playerId)
        return gameManager
    }
}