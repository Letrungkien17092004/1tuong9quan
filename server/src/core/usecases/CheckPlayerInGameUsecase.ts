import { IPlayerRepository,  IGameManagerRepository} from "../interface/repositories/index.js";

export default class CheckPlayerInGameUsecase {
    private gameManagerRepo: IGameManagerRepository

    constructor(gameManagerRepo: IGameManagerRepository) {
        this.gameManagerRepo = gameManagerRepo
    }

    async excute(playerId: string): Promise<boolean> {
        const game = this.gameManagerRepo.findByPlayerId(playerId)
        return game ? true : false
    }
}