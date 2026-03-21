import { GameEngine, Piece } from "./index.js"


export default class GameManager {
    private gameEngine: GameEngine
    private playerMappingSide: Map<string, "blue" | "green">
    private currentTurn: "blue" | "green" = "blue"
    private playerAId: string
    private playerBId: string

    gameId: string
    totalBluePiece = 10
    totalGreenPiece = 10
    isDone = false
    gameStatus: "idle" | "playing" | "disconnect" = "idle"


    constructor(playerAId: string, playerBId: string, gameId: string) {
        this.gameEngine = new GameEngine()
        this.playerMappingSide = new Map<string, "blue" | "green">([
            [playerAId, "blue"],
            [playerBId, "green"]
        ])
        this.gameId = gameId
        this.playerAId = playerAId
        this.playerBId = playerBId
    }

    canMove(pieceId: string, nodeId: string, playerId: string): boolean {
        const sideOfPlayer = this.playerMappingSide.get(playerId)

        // it is not your turn
        if (sideOfPlayer !== this.currentTurn) { return false }

        // the piece must be yours
        const piece = this.gameEngine.getPieceById(pieceId)
        if (!piece) { return false }
        if (piece.side !== sideOfPlayer) { return false }
        return this.gameEngine.canMove(pieceId, nodeId)
    }

    canCapture(attackerId: string, targetId: string, playerId: string): boolean {
        const sideOfPlayer = this.playerMappingSide.get(playerId)

        // it is not your turn
        if (sideOfPlayer !== this.currentTurn) { return false }

        // the piece must be yours
        const piece = this.gameEngine.getPieceById(attackerId)
        if (!piece) { return false }
        if (piece.side !== sideOfPlayer) { return false }
        return this.gameEngine.canCapture(attackerId, targetId)

    }

    move(pieceId: string, nodeId: string): void {
        this.gameEngine.move(pieceId, nodeId)
    }

    capture(attackerId: string, targetId: string): void {
        this.gameEngine.capture(attackerId, targetId)
    }

    getPieceState(): Piece[] {
        return [...this.gameEngine.pieces]
    }

    nextTurn(): void {
        if (this.currentTurn === "blue") {
            this.currentTurn = "green"
        } else {
            this.currentTurn = "blue"
        }
    }

    clone() {
        const copy = new GameManager(
            this.playerAId,
            this.playerBId,
            this.gameId,
        )
        copy.gameEngine = this.gameEngine.clone()
        copy.playerMappingSide = { ...this.playerMappingSide }
        copy.currentTurn = this.currentTurn
        copy.totalBluePiece = this.totalBluePiece
        copy.totalGreenPiece = this.totalGreenPiece
        copy.isDone = this.isDone
        copy.gameStatus = this.gameStatus

        return copy
    }

}