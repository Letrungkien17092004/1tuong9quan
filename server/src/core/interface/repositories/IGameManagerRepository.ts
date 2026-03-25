import { GameManager } from "../../entities/index.js"

export default interface IGameManagerRepository {

    create(playerAId: string, playerBId: string): Promise<GameManager>

    findByGameId(gameId: string): Promise<GameManager | undefined>
    findByPlayerId(playerId: string): Promise<GameManager | undefined>

    getPlayersInGame(gameId: string): Promise<string[]>

    setGameStatus(gameId: string, status: "idle" | "playing" | "disconnect"): Promise<void>

    removeGame(gameId: string): Promise<void>
}