import { IPlayerRepository } from "../core/interface/repositories/index.js";
import { Player } from "../core/entities/index.js"

export default class PlayerRepository implements IPlayerRepository {
    private playerMap: Map<string, Player>
    private playerCount = 1

    constructor() {
        this.playerMap = new Map()

        // seed data
        // PRODUCTION WARNING
        this.playerMap.set("1", new Player("1", "tester 1"))
        this.playerMap.set("2", new Player("2", "tester 2"))
        this.playerMap.set("3", new Player("3", "tester 3"))
        this.playerMap.set("4", new Player("4", "tester 4"))
        this.playerMap.set("5", new Player("5", "tester 5"))
        this.playerMap.set("6", new Player("6", "tester 6"))
        this.playerMap.set("7", new Player("7", "tester 7"))
        this.playerMap.set("8", new Player("8", "tester 8"))
        this.playerMap.set("9", new Player("9", "tester 9"))
        this.playerMap.set("10", new Player("10", "tester 10"))

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
    async findPlayerById(playerId: string): Promise<Player | undefined> {
        const player = this.playerMap.get(playerId)
        return player ? player.clone() : undefined
    }

}