import { useCallback, useMemo, useRef, useState } from "react"
import { usePlayOnline } from "./index"

type Piece = {
    pieceId: string
    side: "green" | "blue"
    isKing: boolean
    nodeId: string
}

type Node = {
    nodeId: string
    row: number
    col: number
}


type MatchState = {
    yourSide: "blue" | "green",
    status: "pending-join" | "playing" | "anyone-disconnect" | "done" | "break",
    bluePlayerStatus: "pending-join" | "joined" | "playing" | "disconnect",
    greenPlayerStatus: "pending-join" | "joined" | "playing" | "disconnect",
    gameManagerState?: {
        pieces: {
            pieceId: string
            side: "green" | "blue"
            isKing: boolean
            nodeId: string
        }[],
        currentTurn: "blue" | "green",
        remainingBluePiece: number,
        remainingGreenPiece: number,
        winner?: "blue" | "green"
    }
}


type SummaryStatus = {
    matchStatus: "pending-join" | "playing" | "anyone-disconnect" | "done" | "break",
    bluePlayerStatus: "pending-join" | "joined" | "playing" | "disconnect",
    greenPlayerStatus: "pending-join" | "joined" | "playing" | "disconnect"
}

function createDefaultPiece(): Piece[] {

    const result: Piece[] = []

    const greenNodes = [
        "A0", "A1", "A2", "A3", "A4",
        "B0", "B1", "B3", "B4", "C0"
    ]

    const blueNodes = [
        "C4", "D0", "D1", "D3", "D4",
        "E0", "E1", "E2", "E3", "E4"
    ]

    let id = 0

    greenNodes.forEach(node => {
        result.push({
            pieceId: `piece_green_${id}`,
            side: "green",
            isKing: node === "A2",
            nodeId: node
        })
        id++
    })

    blueNodes.forEach(node => {
        result.push({
            pieceId: `piece_blue_${id}`,
            side: "blue",
            isKing: node === "E2",
            nodeId: node
        })
        id++
    })

    return result
}

export default function useOnlineEngine() {
    const [matchState, setMatchState] = useState<MatchState | undefined>(undefined)
    const winner: "blue" | "green" | undefined = useMemo(() => {
        if (matchState && matchState.gameManagerState) {
            return matchState.gameManagerState.winner
        }
        return undefined
    }, [matchState])
    const remainingPiece: { blue: number, green: number } = useMemo(() => {
        if (matchState && matchState.gameManagerState) {
            return {
                blue: matchState.gameManagerState.remainingBluePiece,
                green: matchState.gameManagerState.remainingGreenPiece
            }
        }

        return {
            blue: 10,
            green: 10
        }
    }, [matchState])

    const yourSide: "blue" | "green" = useMemo(() => {
        if (matchState && matchState.gameManagerState) {
            return matchState.yourSide
        }
        return "blue"
    }, [matchState])

    const currentTurn: "blue" | "green" = useMemo(() => {
        if (matchState && matchState.gameManagerState) {
            return matchState.gameManagerState.currentTurn
        }
        return "blue"
    }, [matchState])

    const summaryStatus: SummaryStatus = useMemo(() => {
        if (matchState) {
            return {
                matchStatus: matchState.status,
                bluePlayerStatus: matchState.bluePlayerStatus,
                greenPlayerStatus: matchState.greenPlayerStatus,
            }
        }

        return {
            matchStatus: "pending-join",
            bluePlayerStatus: "pending-join",
            greenPlayerStatus: "pending-join"
        }

    }, [matchState])

    const nodes = useMemo(() => {
        const result: Node[] = []

        const rowNames = ["A", "B", "C", "D", "E"]

        rowNames.forEach((rowName, rowIdx) => {
            for (let col = 0; col < 5; col++) {
                result.push({
                    nodeId: `${rowName}${col}`,
                    row: rowIdx,
                    col
                })
            }
        })
        return result
    }, [])

    const pieces: Piece[] = useMemo(() => {

        const defaultPiece: Piece[] = createDefaultPiece()

        if (matchState && matchState.gameManagerState) {
            return matchState.gameManagerState.pieces
        }

        return defaultPiece

    }, [matchState])

    const getPieceById = useCallback((pieceId: string) => {
        return pieces.find(item => item.pieceId === pieceId)
    }, [pieces])

    return {
        nodes,
        pieces,
        setMatchState,
        yourSide: yourSide,
        remainingPiece,
        currentTurn,
        summaryStatus,
        getPieceById,
        winner
    }
}