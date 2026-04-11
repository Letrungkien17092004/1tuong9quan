import { Match, GameManager, Player } from "../../entities/index.js";

export default interface IMatchRepository {

    create(): Promise<Match>

    findById(matchId: string): Promise<Match | undefined>

    updatePlayer(matchId: string, player: Player): Promise<Match>

    setPlayerDisconnect(matchId: string, player: Player): Promise<Match>

    getReferrence(matchId: string): Promise<Match | undefined>

    delete(matchId: string): Promise<void>

}