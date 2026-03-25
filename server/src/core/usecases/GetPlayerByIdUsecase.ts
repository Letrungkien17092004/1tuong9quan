import { IPlayerRepository } from "../interface/repositories/index.js";
import { Player } from "../entities/index.js"


export default class GetPlayerByIdUsecase {
    private playerRepo: IPlayerRepository

    constructor(playerRepo: IPlayerRepository) {
        this.playerRepo = playerRepo
    }

    async excute(playerId: string): Promise<Player | undefined> {
        const player = this.playerRepo.getPlayerById(playerId)
        return player
    }
}