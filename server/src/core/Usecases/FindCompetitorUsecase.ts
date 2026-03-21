import { IPlayerRepository } from "../Interface/Repositories/index.js";
import { Player } from "../Entities/index.js"
export default class FindCompetitorUsecase {
    private playerRepo: IPlayerRepository

    constructor(playerRepo: IPlayerRepository) {
        this.playerRepo = playerRepo
    }

    /**
     * 
     */
    excute(): Player | undefined {
        const competitor = this.playerRepo.popPlayerFromQueue()
        return competitor
    }
}