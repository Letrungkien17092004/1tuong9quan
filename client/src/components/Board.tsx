import BoardGrid from './BoardGrid.tsx'
import PiecesLayer from './PiecesLayer.tsx'
import GridNode from './GridNode.tsx'

const ROWS = 5
const COLS = 5
const CELL = 100
const OFFSET = 2
const STROKE = 2
const WIDTH = (COLS - 1) * CELL + OFFSET * 2
const HEIGHT = (ROWS - 1) * CELL + OFFSET * 2

interface BoardNode {
    nodeId: string,
    pos: {
        x: number,
        y: number
    }
}

interface PieceNode {
    side: "red" | "blue",
    isKing: boolean,
    nodeId: string
}

export default function Board() {
    const nodes: BoardNode[] = []
    const rowNames: ["A", "B", "C", "D", "E"] = ["A", "B", "C", "D", "E"]
    rowNames.forEach((rowName, rowIdx) => {
        for (let i = 0; i < COLS; i++) {
            nodes.push({
                nodeId: `${rowName}${i}`,
                pos: {
                    x: i * CELL,
                    y: rowIdx * CELL
                }
            })
        }
    })
    console.log(nodes)
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
                        nodes={nodes}
                    />
                    {/* <PiecesLayer
                        CELL={CELL}
                        STROKE={STROKE}
                    /> */}
                </svg>
            </div>
        </div>
    </>
}