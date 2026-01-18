import type { IBoardGraph, IBoardNode, IPieceNode } from '../types/index.ts'
import BoardGraphService from '../services/BoardGraphService.ts'
import { useCallback, useRef, useState } from 'react'


export default function useBoardManager(ROWS: number, COLS: number, CELL: number) {
    const engineRef = useRef<IBoardGraph>(new BoardGraphService(ROWS, COLS, CELL))
    const [nodes] = useState<IBoardNode[]>([...engineRef.current.nodes])
    const [pieces, setPieces] = useState<IPieceNode[]>([...engineRef.current.pieces])
    const [selectedPieceId, setSelectedPieceId] = useState<string | undefined>(undefined)
    const [isSelectKing, setIsSelectKing] = useState<boolean>(false)

    const attemptMove = useCallback((desNodeId: string) => {
        if (!selectedPieceId) { return }
        console.log(selectedPieceId)
        engineRef.current.attemptMove(selectedPieceId, desNodeId)
        // refesh nodes state
        setPieces([...engineRef.current.pieces])
        console.log("done move")
    }, [selectedPieceId])

    const tryCapturePiece = useCallback((desPieceId: string) => {
        if (!selectedPieceId) { return }
        const captureStatus = engineRef.current.tryCapturePiece(selectedPieceId, desPieceId)
        console.log("captureStatus ", captureStatus)
        setPieces([...engineRef.current.pieces])
    }, [selectedPieceId])




    const selectPiece = useCallback((pieceId: string) => {
        const found = engineRef.current.pieces.find(_piece => _piece.pieceId === pieceId)
        if (!found) { throw new Error("invalid pieceId, piece was not found") }

        // unclick if previous piece == current piece
        if (selectedPieceId === found.pieceId) {
            setIsSelectKing(found.isKing)
            setSelectedPieceId(undefined)
        } else {
            setIsSelectKing(found.isKing)
            setSelectedPieceId(pieceId)
        }
    }, [selectedPieceId, isSelectKing])

    return {
        nodes,
        pieces,
        selectedPieceId,
        attemptMove,
        selectPiece,
        isSelectKing,
        tryCapturePiece
    }
}