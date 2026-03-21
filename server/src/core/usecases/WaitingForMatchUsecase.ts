import { IPlayerRepository } from "../interface/repositories";


export default class WaitingForMatchUsecase {
    private playerRepo: IPlayerRepository

    constructor(playerRepo: IPlayerRepository) {
        this.playerRepo = playerRepo
    }

    excute(playerId: string): void {
        const player = this.playerRepo.getPlayerById(playerId)
        if (!player) { throw new Error("player wasn't found") }
        const isInQueue = this.playerRepo.isInQueue(playerId)
        if (isInQueue) { throw new Error("player already in queue") }
        this.playerRepo.pushToGameQueue(player)
    }
}