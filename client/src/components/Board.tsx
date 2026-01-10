import BoardGrid from './BoardGrid.tsx'
import PiecesLayer from './PiecesLayer.tsx'
import GridNode from './GridNode.tsx'
// import type { IBoardGraph } from '../types/index.ts'
// import BoardGraphService from '../services/BoardGraphService.ts'
import { useBoardGraph } from "../hooks/index.ts"
import { useCallback, useState } from 'react'

const ROWS = 5
const COLS = 5
const CELL = 100
const OFFSET = 2
const STROKE = 2
const WIDTH = (COLS - 1) * CELL + OFFSET * 2
const HEIGHT = (ROWS - 1) * CELL + OFFSET * 2


export default function Board() {
    const { nodesInPixel, piecesWithPixel, movePiece, clickedPiece, onClickPiece } = useBoardGraph(ROWS, COLS, CELL)

    const onClickPieceEvent = useCallback((pieceId: string) => {
        return (e: React.MouseEvent) => {
            e.stopPropagation()
            e.preventDefault()
            console.log(`clicked to piece ${pieceId}`)
            onClickPiece(pieceId)
        }
    }, [])

    const onClickNodeEvent = useCallback((nodeId: string) => {
        return (e: React.MouseEvent) => {
            e.stopPropagation()
            e.preventDefault()
            console.log(`clicked to node ${nodeId}`)
            console.log("clicked PieceId ", clickedPiece?.pieceId)
            if (clickedPiece) {
                movePiece(clickedPiece.pieceId, nodeId)
            }
        }
    }, [clickedPiece, movePiece])

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
                    <GridNode
                        CELL={CELL}
                        nodesInPixel={nodesInPixel}
                        onClickNode={onClickNodeEvent}
                    />

                    <PiecesLayer
                        CELL={CELL}
                        STROKE={STROKE}
                        piecesWithPixel={piecesWithPixel}
                        onClickPiece={onClickPieceEvent}
                    />
                </svg>
            </div>
        </div>
    </>
}