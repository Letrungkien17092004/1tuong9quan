import { IGameManagerRepository } from "../interface/repositories/index.js";
import { Player, GameManager } from "../entities/index.js"

export default class CreateGameUsecase {
    private gameManagerRepo: IGameManagerRepository

    constructor(gameManagerRepo: IGameManagerRepository) {
        this.gameManagerRepo = gameManagerRepo
    }

    async excute(playerA: Player, playerB: Player): Promise<GameManager> {
        const gameManager = this.gameManagerRepo.create(playerA.playerId, playerB.playerId)
        return gameManager
    }
}