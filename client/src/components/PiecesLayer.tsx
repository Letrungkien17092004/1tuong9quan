import Piece from "./Piece"
import type { IPieceNode } from "../types/index.ts"

interface PiecesLayerProps {
    cellSize: number,
    stroke: number,
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

export default function PiecesLayer({ cellSize, stroke, piecesToRender, onClickPiece }: PiecesLayerProps) {
    const pieceReactElm = piecesToRender.map(piece =>
        <Piece
            key={`${piece.pieceId}`}
            pos={piece.pos}
            onClick={onClickPiece(piece.pieceId)}
            r={cellSize / 5}
            stroke={stroke}
            side={piece.side}
            isKing={piece.isKing}
            isClicked={piece.isClicked}
        />
    )
    return <>
        {pieceReactElm}
    </>
}