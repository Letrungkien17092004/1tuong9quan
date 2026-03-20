import { GameEngine, IPiece } from "./index.js"


interface IGameManager {
    canMove(pieceId: string, nodeId: string, playerId: string): boolean
    canCapture(attackerId: string, targetId: string, playerId: string): boolean

    move(pieceId: string, nodeId: string): void
    capture(attackerId: string, targetId: string): void

    getPieceState(): IPiece[]
    nextTurn(): void
}

export default class GameManager implements IGameManager {
    private gameEngine: GameEngine
    private playerMappingSide: Map<string, "blue" | "green">
    private currentTurn: "blue" | "green" = "blue"
    gameId: string
    totalBluePiece = 10
    totalGreenPiece = 10
    isDone = false
    gameStatus: "idle" | "playing" | "disconnect" = "idle" // tôi thêm trạng thái game trong đó "disconnect" tức là người chơi bị mất kết nối

    constructor(playerAId: string, playerBId: string, gameId: string) {
        this.gameEngine = new GameEngine()
        this.playerMappingSide = new Map<string, "blue" | "green">([
            [playerAId, "blue"],
            [playerBId, "green"]
        ])
        this.gameId = gameId
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

    getPieceState(): IPiece[] {
        return [...this.gameEngine.pieces]
    }

    nextTurn(): void {
        if (this.currentTurn === "blue") {
            this.currentTurn = "green"
        } else {
            this.currentTurn = "blue"
        }
    }



}