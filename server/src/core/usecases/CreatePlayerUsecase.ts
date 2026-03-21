import { IPlayerRepository } from "../interface/repositories/index.js";
import { Player } from "../entities/index.js"

export default class ICreatePlayerRepository {
    private repo: IPlayerRepository
    constructor(repo: IPlayerRepository) {
        this.repo = repo
    }
    
    excute(): Player {
        return this.repo.generatePLayer()
    }
}