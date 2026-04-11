import { Player } from "../../entities/index.js"

export default interface IPlayerRepository {
    generatePLayer(): Promise<Player>
    findPlayerById(playerId: string): Promise<Player | undefined>
}