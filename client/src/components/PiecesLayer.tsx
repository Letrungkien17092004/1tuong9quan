import Piece from "./Piece"
import type { IPieceNode } from "../types/index.ts"

interface PiecesLayerProps {
    CELL: number,
    STROKE: number,
    piecesWithPixel: (IPieceNode & {
        pos: {
            x: number,
            y: number
        }
    })[],
    onClickPiece: (nodeId: string) => (e: React.MouseEvent) => void
}

export default function PiecesLayer({ CELL, STROKE, piecesWithPixel, onClickPiece }: PiecesLayerProps) {
    const pieceReactElm = piecesWithPixel.map(piece =>
        <Piece
            key={`${piece.nodeId}${piece.side}`}
            pos={piece.pos}
            onClick={onClickPiece(piece.nodeId)}
            r={CELL / 5}
            stroke={STROKE}
            side={piece.side}
            isKing={piece.isKing}
            text="VUA"
        />
    )
    console.log(pieceReactElm)
    console.log(typeof pieceReactElm[0])
    return <>
        {pieceReactElm}
    </>
}