import type { IBoardGraph, IPieceNode } from '../types/index.ts'
import BoardGraphService from '../services/BoardGraphService.ts'
import { useCallback, useRef, useState } from 'react'

type NodeInPixel = {
    nodeId: string,
    pos: {
        x: number,
        y: number
    }
}

type PieceWithPixel = IPieceNode & {
    pos: {
        x: number,
        y: number
    },
    isClicked: boolean
}

export default function useBoardGraph(ROWS: number, COLS: number, CELL: number) {
    const boardGraphRef = useRef<IBoardGraph>(new BoardGraphService(ROWS, COLS, CELL))

    const [nodesInPixel] = useState<NodeInPixel[]>(boardGraphRef.current.nodes.map(node => ({
        nodeId: node.nodeId,
        pos: boardGraphRef.current.convertNodeToPixel(node.nodeId)
    })))
    const [piecesWithPixel, setPiecesWithPixel] = useState<PieceWithPixel[]>(boardGraphRef.current.pieces.map(piece => ({
        pieceId: piece.pieceId,
        side: piece.side,
        isKing: piece.isKing,
        nodeId: piece.nodeId,
        pos: boardGraphRef.current.convertNodeToPixel(piece.nodeId),
        isClicked: false
    })))

    const [clickedPiece, setClickedPiece] = useState<IPieceNode | undefined>(undefined)


    const movePiece = useCallback((fromPieceId: string, toNodeId: string): boolean => {
        const piece = boardGraphRef.current.getPieceById(fromPieceId)
        if (!piece) { throw new Error("invalid pieceId, piece was not found") }
        const canMove = boardGraphRef.current.canMove(piece.nodeId, toNodeId)

        if (canMove === true) {
            boardGraphRef.current.movePiece(fromPieceId, toNodeId)
            const newPieceWithPixel = [...piecesWithPixel]
            const pieceWithPixel = newPieceWithPixel.find(p => p.pieceId === fromPieceId)
            console.log("p: ", pieceWithPixel)
            if (pieceWithPixel) {
                pieceWithPixel.nodeId = toNodeId
                pieceWithPixel.pos = boardGraphRef.current.convertNodeToPixel(pieceWithPixel.nodeId)
                console.log("update pixel after move")
            }

            setPiecesWithPixel(newPieceWithPixel)
            return true
        }
        return false
    }, [])

    const onClickPiece = useCallback((pieceId: string) => {
        const found = boardGraphRef.current.pieces.find(_piece => _piece.pieceId === pieceId)
        if (!found) { throw new Error("invalid pieceId, piece was not found") }

        // refesh click and set current click
        const piecesWithPixelCopy = [...piecesWithPixel]
        for (let i = 0; i < piecesWithPixelCopy.length; i++) {
            const pieceWithPixel = piecesWithPixelCopy[i]
            if (pieceWithPixel.pieceId === pieceId) {
                pieceWithPixel.isClicked = true
            } else {
                pieceWithPixel.isClicked = false
            }
        }
        setPiecesWithPixel(piecesWithPixelCopy)
        setClickedPiece(found)


    }, [piecesWithPixel])

    return {
        nodesInPixel,
        piecesWithPixel,
        movePiece,
        clickedPiece,
        onClickPiece
    }
}