import { GameManager, Player } from "./index.js"

export default class Match {
    matchId: string
    gameManager?: GameManager
    playerA?: Player
    playerB?: Player
    status: "pending-join" | "playing" | "stop" | "done" | "break" = "pending-join"

    constructor(options: {
        matchId: string
        gameManager?: GameManager
        playerA?: Player
        playerB?: Player
        status: "pending-join" | "playing" | "stop" | "done" | "break"
    }) {
        this.matchId = options.matchId
        this.gameManager = options.gameManager
        this.playerA = options.playerA
        this.playerB = options.playerB
        this.status = options.status
    }

    clone(): Match {
        const copy = new Match({
            matchId: this.matchId,
            gameManager: this.gameManager?.clone(),
            playerA: this.playerA?.clone(),
            playerB: this.playerB?.clone(),
            status: this.status
        })
        return copy
    }
}