
interface PiecesLayerProps {
    CELL: number,
    nodesInPixel: {
        nodeId: string,
        pos: {
            x: number,
            y: number
        }
    }[],
    onClickNode: (nodeId: string) => (e: React.MouseEvent) => void
}

export default function GridNode({ CELL, nodesInPixel, onClickNode }: PiecesLayerProps) {

    return <>
        {nodesInPixel.map(node => (
            <g
                key={`gridNode${node.nodeId}`}
                transform={`translate(${node.pos.x}, ${node.pos.y})`}
                onClick={onClickNode(node.nodeId)}
            >
                <circle
                    fill="#00000000"
                    r={CELL / 5}
                />
            </g>)
        )}
    </>
}