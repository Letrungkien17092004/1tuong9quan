import { GameEngine, Piece } from "./index.js"

export type GameManagerState = {
    pieces: Piece[]
    currentTurn: "blue" | "green"
    remainingBluePiece: number
    remainingGreenPiece: number
}

export default class GameManager {
    private gameEngine: GameEngine
    private currentTurn: "blue" | "green" = "blue"
    private bluePlayerId: string
    private greenPlayerId: string

    remainingBluePiece = 10
    remainingGreenPiece = 10


    constructor(bluePlayerId: string, greenPlayerId: string) {
        this.gameEngine = new GameEngine()
        this.bluePlayerId = bluePlayerId
        this.greenPlayerId = greenPlayerId
    }

    performMove(playerId: string, pieceId: string, nodeId: string): void {
        let validTurn = this.isTurnFor(playerId)
        if (validTurn) {
            this.gameEngine.performMove(pieceId, nodeId)
        }
        throw new Error("it isn't your turn")
    }

    perFormCapture(playerId: string, attackerId: string, targetId: string): void {
        let validTurn = this.isTurnFor(playerId)
        if (validTurn) {
        this.gameEngine.performCapture(attackerId, targetId)
        }
        throw new Error("it isn't your turn")
    }

    getState(): GameManagerState {
        return {
            pieces: [...this.gameEngine.pieces],
            currentTurn: this.currentTurn,
            remainingBluePiece: this.remainingBluePiece,
            remainingGreenPiece: this.remainingGreenPiece
        }
    }

    nextTurn(): void {
        if (this.currentTurn === "blue") {
            this.currentTurn = "green"
        } else {
            this.currentTurn = "blue"
        }
    }

    isTurnFor(playerId: string): boolean {
        if (playerId === this.bluePlayerId && this.currentTurn === "blue") { return true }
        if (playerId === this.greenPlayerId && this.currentTurn === "green") { return true }
        return false
    }

    clone() {
        const copy = new GameManager(
            this.bluePlayerId,
            this.greenPlayerId,
        )
        copy.gameEngine = this.gameEngine.clone()
        copy.currentTurn = this.currentTurn
        copy.remainingBluePiece = this.remainingBluePiece
        copy.remainingGreenPiece = this.remainingGreenPiece

        return copy
    }

}