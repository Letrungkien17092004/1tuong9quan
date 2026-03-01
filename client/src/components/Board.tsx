import BoardGrid from './BoardGrid.tsx'
import PiecesLayer from './PiecesLayer.tsx'
import NodesLayer from './NodesLayer.tsx'
import { useBoardManager } from "../hooks/index.ts"
import { useCallback, useEffect, useState } from 'react'


const CELLSIZE = 100
const OFFSET = 2
const STROKE = 2
const WIDTH = (5 - 1) * CELLSIZE + OFFSET * 2
const HEIGHT = (5 - 1) * CELLSIZE + OFFSET * 2

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
    } = useBoardManager(CELLSIZE)

    const [nodesToRender] = useState<NodeToRender[]>(nodes.map(node => ({
        nodeId: node.nodeId,
        pos: {
            x: node.col * CELLSIZE,
            y: node.row * CELLSIZE
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
                        cellSize={CELLSIZE}
                        offset={OFFSET}
                        stroke={STROKE}
                    />

                    {/* invisiable */}
                    <NodesLayer
                        cellSize={CELLSIZE}
                        nodesToRender={nodesToRender}
                        onClickNode={createClickNodeEventHandler}
                    />

                    <PiecesLayer
                        cellSize={CELLSIZE}
                        stroke={STROKE}
                        piecesToRender={piecesToRender}
                        onClickPiece={createClickPieceEventHandler}
                    />
                </svg>
            </div>
        </div>
    </>
}