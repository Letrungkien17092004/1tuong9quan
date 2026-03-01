
interface BoardGridProps {
    cellSize: number,
    offset: number,
    stroke: number,
}

export default function BoardGrid({ cellSize, offset, stroke }: BoardGridProps) {
    const lines: React.ReactNode[] = []

    // horizontal
    for (let row = 0; row < 5; row++) {
        if (row == 5 - 1) {
            lines.push(<line
                key={`${row}row1${Date.now().toString(20)}`}
                x1={offset}
                y1={-offset + cellSize * row - stroke}
                x2={-offset + (5 - 1) * cellSize}
                y2={-offset + row * cellSize - stroke}
                stroke="black"
                strokeWidth={stroke}
            />
            )
        } else {
            lines.push(<line
                key={`${row}row2${Date.now().toString(20)}`}
                x1={offset}
                y1={offset + cellSize * row}
                x2={-offset + (5 - 1) * cellSize}
                y2={offset + row * cellSize}
                stroke="black"
                strokeWidth={stroke}
            />
            )
        }
    }

    // vertical
    for (let col = 0; col < 5; col++) {
        if (col == 5 - 1) {
            lines.push(<line
                key={`${col}col1${Date.now().toString(20)}`}
                x1={-offset + cellSize * col}
                y1={offset}
                x2={-offset + col * cellSize}
                y2={-offset + (5 - 1) * cellSize - stroke}
                stroke="black"
                strokeWidth={stroke}
            />
            )
        } else {
            lines.push(<line
                key={`${col}col2${Date.now().toString(20)}`}
                x1={offset + cellSize * col}
                y1={offset}
                x2={offset + col * cellSize}
                y2={-offset + (5 - 1) * cellSize - stroke}
                stroke="black"
                strokeWidth={stroke}
            />
            )
        }
    }

    // main cross
    lines.push(<line
        key={`mainCross1${Date.now().toString(20)}`}
        x1={offset}
        y1={offset}
        x2={(5 - 1) * cellSize - stroke - offset + 1} // +1 and -1 are offset compensations
        y2={(5 - 1) * cellSize - stroke - offset - 1}
        stroke="black"
        strokeWidth={stroke}
    />
    )


    lines.push(<line
        key={`mainCross2${Date.now().toString(20)}`}
        x1={offset}
        y1={(5 - 1) * cellSize - stroke - offset - 1}
        x2={(5 - 1) * cellSize - offset + 1} // +1 and -1 are offset compensations
        y2={offset}
        stroke="black"
        strokeWidth={stroke}
    />
    )

    // sub cross

    lines.push(<line
        key={`subCross1${Date.now().toString(20)}`}
        x1={offset}
        y1={offset + (5 - 2 - 1) * cellSize}
        x2={offset + (5 - 2 - 1) * cellSize}
        y2={offset}
        stroke="black"
        strokeWidth={stroke}
    />
    )

    lines.push(<line
        key={`subCross2${Date.now().toString(20)}`}
        x1={-offset + (cellSize * 2) + 2}
        y1={-offset + (5 - 2 - 1) * cellSize + (cellSize * 2) - 1}
        x2={-offset + (5 - 2 - 1) * cellSize + (cellSize * 2) + 1}
        y2={-offset + (cellSize * 2) + 1}
        stroke="black"
        strokeWidth={stroke}
    />
    )

    lines.push(<line
        key={`subCross3${Date.now().toString(20)}`}
        x1={offset}
        y1={offset + (5 - 2 - 1) * cellSize}
        x2={-offset + (cellSize * 2) + 2}
        y2={-offset + (5 - 2 - 1) * cellSize + (cellSize * 2) - 1}
        stroke="black"
        strokeWidth={stroke}
    />
    )

    lines.push(<line
        key={`subCross4${Date.now().toString(20)}`}
        x1={offset + (5 - 2 - 1) * cellSize}
        y1={offset}
        x2={-offset + (5 - 2 - 1) * cellSize + (cellSize * 2) + 1}
        y2={-offset + (cellSize * 2) + 1}
        stroke="black"
        strokeWidth={stroke}
    />
    )


    return <>
        {
            lines
        }
    </>
}