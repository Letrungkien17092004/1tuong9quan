import Piece from "./Piece"

interface PiecesLayerProps {
    CELL: number,
    STROKE: number,
    nodes: {
        nodeId: string,
        pos: {
            x: number,
            y: number
        }
    }[]
}

export default function GridNode({ CELL, STROKE, nodes }: PiecesLayerProps) {

    return <>
        {nodes.map(node => (
            <Piece
                pos={{ x: node.pos.x, y: node.pos.y }}
                r={CELL / 5}
                stroke={STROKE}
                side="green"
                isKing={true}
                text={node.nodeId}
            />))}
    </>
}