import { IMatchRepository } from "../interface/repositories/index.js";
import { Match } from "../entities/index.js";

export default class CreateMatchUsecase {
    private matchRepo: IMatchRepository

    constructor(matchRepo: IMatchRepository) {
        this.matchRepo = matchRepo
    }

    async execute(): Promise<Match> {
        const newMatch = await this.matchRepo.create()
        
        return newMatch
    }
}