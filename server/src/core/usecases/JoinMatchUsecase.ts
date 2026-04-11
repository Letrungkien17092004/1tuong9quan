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

        // Cập nhật player vào match (logic tạo gameManager khi đủ 2 players nằm trong repository)
        match = await this.matchRepo.updatePlayer(matchId, player)

        return match
    }
}
