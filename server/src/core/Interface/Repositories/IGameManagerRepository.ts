import { GameManager } from "../../Entities/index.js"

export default interface IGameManagerRepository {

    create(playerAId: string, playerBId: string): GameManager
    findByPlayerId(playerId: string): GameManager
    findByGameId(gameId: string): GameManager
    addPlayerToGame(playerId: string): GameManager
    removePlayerFromGame(playerId: string): GameManager
    removeGame(gameId: string): void
}