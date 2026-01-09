
interface PieceProps {
    pos: { x: number, y: number }
    r: number,
    stroke: number,
    side: "green" | "blue",
    isKing: boolean,
    text: string,
    onClick: (e: React.MouseEvent) => void

}

export default function Piece({ pos, r, stroke, side, isKing, text, onClick }: PieceProps) {
    return <>
        <g
            transform={`translate(${pos.x}, ${pos.y})`}
            fill={side === "green" ? "#00c951" : "#003dff"}
            className="transition cursor-pointer"
            onClick={onClick}
        >
            <circle
                r={r}
                stroke="black"
                strokeWidth={stroke}
            />
            {isKing && (<text
                fill="#fff"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={r / 1.5}
                fontWeight="bold"
            >
                {text}
            </text>)}
        </g>
    </>
}