import { Player } from "../../Entities"

export default interface IPlayerUsecase {
    generatePLayer(): Player
    pushToGameQueue(player: Player): void
    popPlayerFromQueue(): Player | undefined
    isInQueue(playerId: string): boolean
    getPlayerById(playerId: string): Player | undefined
}