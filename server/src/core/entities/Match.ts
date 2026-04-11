import { GameManager, Player, GameManagerState } from "./index.js"
export type MatchState = {
    status: "pending-join" | "playing" | "anyone-disconnect" | "done" | "break"
    bluePlayerStatus: "pending-join" | "joined" | "playing" | "disconnect"
    greenPlayerStatus: "pending-join" | "joined" | "playing" | "disconnect",
    gameManagerState: GameManagerState | undefined

}
export default class Match {
    matchId: string
    gameManager?: GameManager
    bluePlayer?: Player
    greenPlayer?: Player
    playerToSide: Map<string, "blue" | "green">
    status: "pending-join" | "playing" | "anyone-disconnect" | "done" | "break" = "pending-join"
    bluePlayerStatus: "pending-join" | "joined" | "playing" | "disconnect" = "pending-join"
    greenPlayerStatus: "pending-join" | "joined" | "playing" | "disconnect" = "pending-join"

    constructor(options: {
        matchId: string
        gameManager?: GameManager
        bluePlayer?: Player
        greenPlayer?: Player
        status?: "pending-join" | "playing" | "anyone-disconnect" | "done" | "break"
    }) {
        this.matchId = options.matchId
        this.gameManager = options.gameManager
        this.playerToSide = new Map()
        if (options.bluePlayer) {
            this.bluePlayer = options.bluePlayer
            this.playerToSide.set(options.bluePlayer.playerId, "blue")
        }
        if (options.greenPlayer) {
            this.greenPlayer = options.greenPlayer
            this.playerToSide.set(options.greenPlayer.playerId, "green")
        }
        this.status = options.status || "pending-join"
    }

    getState(): MatchState {
        return {
            status: this.status,
            bluePlayerStatus: this.bluePlayerStatus,
            greenPlayerStatus: this.greenPlayerStatus,
            gameManagerState: this.gameManager?.getState()
        }
    }

    clone(): Match {
        const copy = new Match({
            matchId: this.matchId,
            gameManager: this.gameManager?.clone(),
            bluePlayer: this.bluePlayer?.clone(),
            greenPlayer: this.greenPlayer?.clone(),
            status: this.status
        })

        copy.bluePlayerStatus = this.bluePlayerStatus
        copy.greenPlayerStatus = this.greenPlayerStatus
        copy.playerToSide = new Map(this.playerToSide)
        return copy
    }
}