import { IPlayerRepository } from "../../core/Interface/Repositories/index.js";
import { Player } from "../../core/Entities/index.js"
export default class PlayerRepository implements IPlayerRepository {
    private playerMap: Map<string, Player>
    private gameQueue: Array<Player>
    private playerCount = 1

    constructor() {
        this.playerMap = new Map()
        this.gameQueue = []
    }
    /**
     * generate a new  player then set to playerMap
     * @returns 
     */
    generatePLayer(): Player {
        const newPlayer = new Player(
            crypto.randomUUID(),
            `Ngươi chơi ${this.playerCount}`
        )
        this.playerCount++
        this.playerMap.set(newPlayer.playerId, newPlayer)
        return newPlayer
    }

    /**
     * push a player to gameQueue (waiting line)
     * @param player 
     */
    pushToGameQueue(player: Player): void {
        this.gameQueue.push(player)
    }

    /**
     * pop a player from gameQueue
     * @returns 
     */
    popPlayerFromQueue(): Player | undefined {
        return this.gameQueue.pop()
    }

    /**
     * check a player in gameQueue by playerId
     * @param playerId 
     * @returns 
     */
    isInQueue(playerId: string): boolean {
        return this.gameQueue.some(item => item.playerId === playerId)
    }

    /**
     * retrieve a player by id
     * @param playerId 
     */
    getPlayerById(playerId: string): Player | undefined {
        return this.playerMap.get(playerId)
    }

}