import { IMatchRepository } from "../interface/repositories/index.js";
import { Match, Player, GameManager } from "../entities/index.js";

export default class JoinMatchUsecase {
    private matchRepo: IMatchRepository

    constructor(matchRepo: IMatchRepository) {
        this.matchRepo = matchRepo
    }

    async execute(matchId: string, player: Player): Promise<Match> {
        // Tìm match theo id
        let match = await this.matchRepo.findById(matchId)
        
        if (!match) {
            throw new Error(`match wasn't found`)
        }

        // if player has join
        if (match.playerToSide.get(player.playerId)) {
            throw new Error("player has join")
        }

        // Ghép người chơi vào match
        if (!match.bluePlayer) {
            // Người chơi đầu tiên là blue
            match = await this.matchRepo.update(matchId, { bluePlayer: player, bluePlayerStatus: "joined"})
        } else if (!match.greenPlayer) {
            // Người chơi thứ hai là green
            match = await this.matchRepo.update(matchId, { greenPlayer: player, greenPlayerStatus: "joined" })
        } else {
            throw new Error("Match is already full")
        }

        // Nếu match đã có đủ 2 người chơi
        if (
            match.bluePlayer &&
            match.greenPlayer &&
            match.bluePlayerStatus === "joined" && 
            match.greenPlayerStatus === "joined"

        ) {
            // create gameManger
            const gameManager = new GameManager(match.bluePlayer.playerId, match.greenPlayer.playerId)
            // Cập nhật status match thành "playing" và player status thành "playing"
            match = await this.matchRepo.update(matchId, {
                gameManager: gameManager,
                status: "playing",
                bluePlayerStatus: "playing",
                greenPlayerStatus: "playing"
            })
        }
        return match
    }
}
