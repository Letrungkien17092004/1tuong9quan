import Piece from "./Piece"

interface PiecesLayerProps {
    CELL: number,
    STROKE: number,
}

export default function PiecesLayer({ CELL, STROKE }: PiecesLayerProps) {

    return <>
        <Piece
            pos={{ x: 0, y: 0 }}
            r={CELL / 5}
            stroke={STROKE}
            side="green"
            isKing={false}
            text="VUA"
        />

        <Piece
            pos={{ x: 100, y: 0 }}
            r={CELL / 5}
            stroke={STROKE}
            side="blue"
            isKing={true}
            text="VUA"
        />
    </>
}