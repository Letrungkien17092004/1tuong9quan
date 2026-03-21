import { IPlayerRepository } from "../Interface/Repositories/index.js";
import { Player } from "../Entities/index.js"

export default class ICreatePlayerRepository {
    private repo: IPlayerRepository
    constructor(repo: IPlayerRepository) {
        this.repo = repo
    }
    
    excute(): Player {
        return this.repo.generatePLayer()
    }
}