import { IPlayerRepository } from "../interface/repositories/index.js";
import { Player } from "../entities/index.js"
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