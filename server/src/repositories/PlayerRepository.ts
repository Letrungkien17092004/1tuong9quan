import { IPlayerRepository } from "../core/interface/repositories/index.js";
import { Player } from "../core/entities/index.js"

export default class PlayerRepository implements IPlayerRepository {
    private playerMap: Map<string, Player>
    private playerCount = 1

    constructor() {
        this.playerMap = new Map()
    }
    /**
     * generate a new  player then set to playerMap
     * @returns 
     */
    async generatePLayer(): Promise<Player> {
        const newPlayer = new Player(
            crypto.randomUUID(),
            `Ngươi chơi ${this.playerCount}`
        )
        this.playerCount++
        this.playerMap.set(newPlayer.playerId, newPlayer)
        return newPlayer.clone()
    }
    /**
     * retrieve a player by id
     * @param playerId 
     */
    async getPlayerById(playerId: string): Promise<Player | undefined> {
        const player = this.playerMap.get(playerId)
        return player ? player.clone() : undefined
    }

}