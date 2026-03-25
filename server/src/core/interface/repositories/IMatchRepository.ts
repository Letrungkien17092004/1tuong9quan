import { Match, GameManager, Player } from "../../entities/index.js";

export default interface IMatchRepository {

    create(options: {
        gameManager?: GameManager
        playerA?: Player
        playerB?: Player
        status: "pending-join" | "playing" | "stop" | "done" | "break"
    }): Promise<Match>

    findById(matchId: string): Promise<Match | undefined>

    updatePlayer(matchId: string, players: {
        playerA?: Player,
        playerB?: Player
    }): Promise<void>

    updateStatus(
        matchId: string,
        status: "pending-join" | "playing" | "stop" | "done" | "break"
    ): Promise<void>

    delete(matchId: string): Promise<void>

}