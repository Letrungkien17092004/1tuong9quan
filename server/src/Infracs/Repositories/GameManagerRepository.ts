import { IGameManagerRepository } from "../../core/Interface/Repositories/index.js";
import { GameManager } from "../../core/Entities/index.js";

export default class GameManagerRepository implements IGameManagerRepository {

    private gameMap: Map<string, GameManager> = new Map()
    private playerToGame: Map<string, string> = new Map()
    private gameToPlayers: Map<string, string[]> = new Map()


    create(playerAId: string, playerBId: string): GameManager {

        if (this.playerToGame.has(playerAId) || this.playerToGame.has(playerBId)) {
            throw new Error("player already in a game")
        }

        const gameId = crypto.randomUUID()

        const game = new GameManager(playerAId, playerBId, gameId)

        this.gameMap.set(gameId, game)

        this.playerToGame.set(playerAId, gameId)
        this.playerToGame.set(playerBId, gameId)

        this.gameToPlayers.set(gameId, [playerAId, playerBId])

        return game
    }

    findByGameId(gameId: string): GameManager | undefined {
        return this.gameMap.get(gameId)
    }

    findByPlayerId(playerId: string): GameManager | undefined {

        const gameId = this.playerToGame.get(playerId)
        if (!gameId) return undefined

        return this.gameMap.get(gameId)
    }

    getPlayersInGame(gameId: string): string[] {

        return this.gameToPlayers.get(gameId) ?? []
    }

    setGameStatus(gameId: string, status: "idle" | "playing" | "disconnect"): void {

        const game = this.gameMap.get(gameId)
        if (!game) throw new Error("game not found")

        game.gameStatus = status
    }

    removeGame(gameId: string): void {

        const players = this.gameToPlayers.get(gameId) ?? []

        for (const playerId of players) {
            this.playerToGame.delete(playerId)
        }

        this.gameToPlayers.delete(gameId)
        this.gameMap.delete(gameId)
    }
}