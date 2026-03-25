import { Player } from "../../entities/index.js"

export default interface IPlayerRepository {
    generatePLayer(): Promise<Player>
    getPlayerById(playerId: string): Promise<Player | undefined>
}