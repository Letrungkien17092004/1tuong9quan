import Piece from "./Piece"
import type { IPieceNode } from "../types/index.ts"

interface PiecesLayerProps {
    CELL: number,
    STROKE: number,
    piecesToRender:  {
        pieceId: string,
        side: "blue" | "green",
        isKing: boolean,
        pos: {
            x: number,
            y: number
        },
        isClicked: boolean
    }[],
    onClickPiece: (pieceId: string) => (e: React.MouseEvent) => void
}

export default function PiecesLayer({ CELL, STROKE, piecesToRender, onClickPiece }: PiecesLayerProps) {
    const pieceReactElm = piecesToRender.map(piece =>
        <Piece
            key={`${piece.pieceId}`}
            pos={piece.pos}
            onClick={onClickPiece(piece.pieceId)}
            r={CELL / 5}
            stroke={STROKE}
            side={piece.side}
            isKing={piece.isKing}
            isClicked={piece.isClicked}
        />
    )
    return <>
        {pieceReactElm}
    </>
}