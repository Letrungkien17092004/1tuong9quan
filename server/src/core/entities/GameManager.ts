import { GameEngine, IPiece } from "./index.js"

export type GameManagerState = {
    pieces: IPiece[]
    currentTurn: "blue" | "green"
    remainingBluePiece: number
    remainingGreenPiece: number
    winner: "blue" | "green" | undefined
}


const blueKingId = "piece_blue_17"
const greenKingId = "piece_green_2"

export default class GameManager {
    private gameEngine: GameEngine
    private currentTurn: "blue" | "green" = "blue"
    winner: "blue" | "green" | undefined = undefined
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
        let piece = this.gameEngine.getPieceById(pieceId)
        let playerSide = this.getSideOfPlayer(playerId)

        if (!validTurn) { throw new Error("it isn't your turn") }

        if (!piece) { throw new Error("piece wasn't found") }

        if (playerSide !== piece.side) { throw new Error("you don't own this piece") }

        this.gameEngine.performMove(pieceId, nodeId)
        this.nextTurn()
    }

    perFormCapture(playerId: string, attackerId: string, targetId: string): void {
        let validTurn = this.isTurnFor(playerId)
        let attacker = this.gameEngine.getPieceById(attackerId)
        let target = this.gameEngine.getPieceById(targetId)
        let playerSide = this.getSideOfPlayer(playerId)

        if (!validTurn) { throw new Error("it isn't your turn") }
        if (!attacker) { throw new Error("attacker wasn't found") }
        if (!target) { throw new Error("target wasn't found") }
        if (attacker.isKing === false) {throw new Error("attacker isn't king")}
        if (playerSide !== attacker.side) { throw new Error("you don't own the attacker") }
        if (attacker.side === target.side) {throw new Error("you can't capture your own piece")}
        if (target.isKing === true) {
            if (playerSide === "blue" && this.remainingGreenPiece > 5)  {
                throw new Error("you can't capture king util you have capture four piece")
            }
            if (playerSide === "green" && this.remainingBluePiece > 5)  {
                throw new Error("you can't capture king util you have capture four piece")
            }
        }


        this.gameEngine.performCapture(attackerId, targetId)
        if (playerSide === "blue") {
            this.remainingGreenPiece--;
        } else {
            this.remainingBluePiece--;
        }
        const blueKing = this.gameEngine.getPieceById(blueKingId)
        const greenKing = this.gameEngine.getPieceById(greenKingId)
        if (!blueKing) {
            this.winner = "green"
        }
        if (!greenKing) {
            this.winner = "blue"
        }
        this.nextTurn()
    }

    getState(): GameManagerState {
        return {
            pieces: [...this.gameEngine.pieces],
            currentTurn: this.currentTurn,
            remainingBluePiece: this.remainingBluePiece,
            remainingGreenPiece: this.remainingGreenPiece,
            winner: this.winner
        }
    }

    getSideOfPlayer(playerId: string): "blue" | "green" {
        if (playerId === this.bluePlayerId) {
            return "blue"
        }
        return "green"
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