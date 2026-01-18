
interface PieceProps {
    pos: { x: number, y: number }
    r: number,
    stroke: number,
    side: "green" | "blue",
    isKing: boolean,
    onClick: (e: React.MouseEvent) => void,
    isClicked: boolean
}

export default function Piece({ pos, r, stroke, side, isKing, onClick, isClicked }: PieceProps) {
    return (
        <g
            style={{
                transform: `translate(${pos.x}px, ${pos.y}px)`,
                transition: 'transform 200ms ease',
                transformBox: 'fill-box',
                transformOrigin: 'center',
            }}
            fill={side === "green" ? "#00c951" : "#003dff"}
            className="transition-all duration-500 cursor-pointer"
            onClick={onClick}
        >
            <circle
                r={r}
                stroke={isClicked ? (side === "green" ? "#006400" : "#00008B") : "black"}
                strokeWidth={isClicked ? stroke * 2 : stroke}
                className="transition-all duration-200"
            />
            {isKing && (
                <text
                    fill="#fff"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={r / 1.5}
                    fontWeight="bold"
                >
                    VUA
                </text>
            )}
        </g>
    );
}