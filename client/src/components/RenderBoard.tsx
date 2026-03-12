import BoardGrid from './BoardGrid.tsx'
import PiecesLayer from './PiecesLayer.tsx'
import NodesLayer from './NodesLayer.tsx'


interface RenderBoardProps {
    cellSize: number,
    offset: number,
    stroke: number,
    width: number,
    height: number,
    nodesToRender: {
        nodeId: string,
        pos: {
            x: number,
            y: number
        }
    }[],
    piecesToRender: {
        pieceId: string,
        side: "blue" | "green",
        isKing: boolean,
        pos: {
            x: number,
            y: number
        },
        isClicked: boolean
    }[],
    nodeClickFactory: (nodeId: string) => (e: React.MouseEvent) => void,
    pieceClickFactory: (pieceId: string) => (e: React.MouseEvent) => void
}

export default function RenderBoard({
    cellSize,
    width,
    height,
    offset,
    stroke,
    nodesToRender,
    piecesToRender,
    nodeClickFactory,
    pieceClickFactory

}: RenderBoardProps) {

    return <>
        <div className="w-full">
            <div className="my-0 mx-auto flex justify-center items-center">
                <svg className='overflow-visible p-1 shadow-2xl' width={width} height={height}>
                    <BoardGrid
                        cellSize={cellSize}
                        offset={offset}
                        stroke={stroke}
                    />

                    {/* invisiable */}
                    <NodesLayer
                        cellSize={cellSize}
                        nodesToRender={nodesToRender}
                        onClickNode={nodeClickFactory}
                    />

                    <PiecesLayer
                        cellSize={cellSize}
                        stroke={stroke}
                        piecesToRender={piecesToRender}
                        onClickPiece={pieceClickFactory}
                    />
                </svg>
            </div>
        </div>
    </>
}