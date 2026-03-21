import { IPlayerRepository,  IGameManagerRepository} from "../interface/repositories/index.js";

export default class CheckPlayerInGameUsecase {
    private gameManagerRepo: IGameManagerRepository

    constructor(gameManagerRepo: IGameManagerRepository) {
        this.gameManagerRepo = gameManagerRepo
    }

    excute(playerId: string): boolean {
        const game = this.gameManagerRepo.findByPlayerId(playerId)
        return game ? true : false
    }
}