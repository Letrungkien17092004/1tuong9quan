import { IMatchRepository } from "../interface/repositories/index.js"

/**
 * this usecase handler that player movement a piece
 */
export default class CapturePieceUsecase {
    private matchRepo: IMatchRepository


    constructor(matchRepo: IMatchRepository) {
        this.matchRepo = matchRepo
    } 

    async excute(matchId: string, playerId: string, attackerId: string, targetId: string): Promise<void> {
        const match = await this.matchRepo.getReferrence(matchId)
        if (!match) { throw new Error("match wasn't found") }
        if (match.status !== "playing") { throw new Error("match isn't playing") }
        if (!match.gameManager) { throw new Error("status is playing but gameManager is undefined") }
        if (!match.playerToSide.get(playerId)) { throw new Error("invalid player") }

        // move
        match.gameManager.perFormCapture(playerId, attackerId, targetId)
    }
}