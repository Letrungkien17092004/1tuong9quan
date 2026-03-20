import { GameManager } from "../../Entities/index.js"

export default interface IGameManagerUsecase {

    create(playerAId: string, playerBId: string): GameManager

    findByGameId(gameId: string): GameManager | null
    findByPlayerId(playerId: string): GameManager | null

    getPlayersInGame(gameId: string): string[]

    setGameStatus(gameId: string, status: "idle" | "playing" | "disconnect"): void

    removeGame(gameId: string): void
}