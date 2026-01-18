import BoardGrid from './BoardGrid.tsx'
import PiecesLayer from './PiecesLayer.tsx'
import NodesLayer from './NodesLayer.tsx'
import { useBoardManager } from "../hooks/index.ts"
import { useCallback, useEffect, useState } from 'react'

const ROWS = 5
const COLS = 5
const CELL = 100
const OFFSET = 2
const STROKE = 2
const WIDTH = (COLS - 1) * CELL + OFFSET * 2
const HEIGHT = (ROWS - 1) * CELL + OFFSET * 2

type NodeToRender = {
    nodeId: string,
    pos: {
        x: number,
        y: number
    }
}

type PieceToRender = {
    pieceId: string,
    side: "blue" | "green",
    isKing: boolean,
    pos: {
        x: number,
        y: number
    },
    isClicked: boolean
}

// utils function
function convertPieceToXYPosition(nodesToRender: NodeToRender[], attachedNodeId: string) {
    const node = nodesToRender.find(nodeRd => nodeRd.nodeId === attachedNodeId)
    if (!node) { throw new Error("node was not found") }
    return node.pos

}

export default function Board() {

    const {
        nodes, pieces, selectedPieceId, selectPiece,
        attemptMove, isSelectKing, tryCapturePiece
    } = useBoardManager(ROWS, COLS, CELL)

    const [nodesToRender] = useState<NodeToRender[]>(nodes.map(node => ({
        nodeId: node.nodeId,
        pos: {
            x: node.col * CELL,
            y: node.row * CELL
        }
    })))

    const [piecesToRender, setPiecesToRender] = useState<PieceToRender[]>(pieces.map(piece => ({
        pieceId: piece.pieceId,
        side: piece.side,
        isKing: piece.isKing,
        isClicked: piece.pieceId === selectedPieceId,
        pos: convertPieceToXYPosition(nodesToRender, piece.nodeId)
    })))

    // refesh piecesToRender
    useEffect(() => {
        setPiecesToRender(pieces.map(piece => ({
            pieceId: piece.pieceId,
            side: piece.side,
            isKing: piece.isKing,
            isClicked: piece.pieceId === selectedPieceId,
            pos: convertPieceToXYPosition(nodesToRender, piece.nodeId)
        })))
    }, [pieces, selectedPieceId, nodesToRender])

    // event handler factory
    const createClickPieceEventHandler = useCallback((pieceId: string) => {
        return (e: React.MouseEvent) => {
            e.stopPropagation()
            e.preventDefault()
            console.log(`clicked to piece ${pieceId}`)
            if (selectedPieceId && isSelectKing) {
                const pieceA = piecesToRender.find(p => p.pieceId === selectedPieceId)
                const pieceB = piecesToRender.find(p => p.pieceId === pieceId)
                if (!pieceA || !pieceB) { throw new Error("Piece was not found") }
                if (pieceA.side !== pieceB.side) {
                    tryCapturePiece(pieceB.pieceId)
                    return
                } else {
                    selectPiece(pieceId)
                }
            } else {
                selectPiece(pieceId)
            }
        }
    }, [selectedPieceId, selectPiece, isSelectKing])

    // event handler factory
    const createClickNodeEventHandler = useCallback((nodeId: string) => {
        return (e: React.MouseEvent) => {
            e.stopPropagation()
            e.preventDefault()
            console.log(`clicked to node ${nodeId}`)
            attemptMove(nodeId)
        }
    }, [attemptMove])

    return <>
        <div className="w-full">
            <div className="w-5/10 my-0 mx-auto flex justify-center items-center">
                <svg className='overflow-visible p-1 shadow-2xl' width={WIDTH} height={HEIGHT}>
                    <BoardGrid
                        COLS={COLS}
                        ROWS={ROWS}
                        CELL={CELL}
                        OFFSET={OFFSET}
                        STROKE={STROKE}
                    />

                    {/* invisiable */}
                    <NodesLayer
                        CELL={CELL}
                        nodesToRender={nodesToRender}
                        onClickNode={createClickNodeEventHandler}
                    />

                    <PiecesLayer
                        CELL={CELL}
                        STROKE={STROKE}
                        piecesToRender={piecesToRender}
                        onClickPiece={createClickPieceEventHandler}
                    />
                </svg>
            </div>
        </div>
    </>
}