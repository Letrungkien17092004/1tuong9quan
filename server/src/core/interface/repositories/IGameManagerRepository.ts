import { GameManager } from "../../entities/index.js"

export default interface IGameManagerRepository {

    create(playerAId: string, playerBId: string): GameManager

    findByGameId(gameId: string): GameManager | undefined
    findByPlayerId(playerId: string): GameManager | undefined

    getPlayersInGame(gameId: string): string[]

    setGameStatus(gameId: string, status: "idle" | "playing" | "disconnect"): void

    removeGame(gameId: string): void
}