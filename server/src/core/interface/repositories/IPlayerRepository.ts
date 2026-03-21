import { Player } from "../../entities/index.js"

export default interface IPlayerRepository {
    generatePLayer(): Player
    pushToGameQueue(player: Player): void
    popPlayerFromQueue(): Player | undefined
    isInQueue(playerId: string): boolean
    getPlayerById(playerId: string): Player | undefined
}