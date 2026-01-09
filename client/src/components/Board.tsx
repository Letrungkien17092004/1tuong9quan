import BoardGrid from './BoardGrid.tsx'
import PiecesLayer from './PiecesLayer.tsx'
import GridNode from './GridNode.tsx'
import type { IBoardGraph } from '../types/index.ts'
import BoardGraphService from '../services/BoardGraphService.ts'
import { useCallback } from 'react'

const ROWS = 5
const COLS = 5
const CELL = 100
const OFFSET = 2
const STROKE = 2
const WIDTH = (COLS - 1) * CELL + OFFSET * 2
const HEIGHT = (ROWS - 1) * CELL + OFFSET * 2


export default function Board() {
    const boardGraph: IBoardGraph = new BoardGraphService(ROWS, COLS, CELL)

    const onClickPiece = useCallback((nodeId: string) => {
        return (e: React.MouseEvent) => {
            e.stopPropagation()
            e.preventDefault()
            console.log(`clicked to piece ${nodeId}`)
        }
    }, [])

    const onClickNode = useCallback((nodeId: string) => {
        return (e: React.MouseEvent) => {
            e.stopPropagation()
            e.preventDefault()
            console.log(`clicked to node ${nodeId}`)
        }
    }, [])

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

                    <GridNode
                        CELL={CELL}
                        STROKE={STROKE}
                        nodesInPixel={boardGraph.nodes.map(node => ({
                            nodeId: node.nodeId,
                            pos: boardGraph.convertNodeToPixel(node.nodeId)
                        }))}
                        onClickNode={onClickNode}
                    />

                    <PiecesLayer
                        CELL={CELL}
                        STROKE={STROKE}
                        piecesWithPixel={boardGraph.pieces.map(piece => {
                            const temp = {
                                ...piece,
                                pos: boardGraph.convertNodeToPixel(piece.nodeId)
                            }
                            return temp
                        })}
                        onClickPiece={onClickPiece}
                    />
                </svg>
            </div>
        </div>
    </>
}