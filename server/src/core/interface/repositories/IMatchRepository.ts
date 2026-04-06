import { Match, GameManager, Player } from "../../entities/index.js";

export default interface IMatchRepository {

    create(options: {
        gameManager?: GameManager
        playerA?: Player
        playerB?: Player
        status: "pending-join" | "playing" | "anyone-disconnect" | "done" | "break"
    }): Promise<Match>

    findById(matchId: string): Promise<Match | undefined>

    update(matchId: string, data: {
        gameManager?: GameManager,
        bluePlayer?: Player,
        greenPlayer?: Player,
        status?: "pending-join" | "playing" | "anyone-disconnect" | "done" | "break",
        bluePlayerStatus?: "pending-join" | "joined" | "playing" | "disconnect",
        greenPlayerStatus?: "pending-join" | "joined" | "playing" | "disconnect"
    }): Promise<Match>

    delete(matchId: string): Promise<void>

}