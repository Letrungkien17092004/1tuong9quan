
interface BoardGridProps {
    COLS: number,
    ROWS: number,
    CELL: number,
    OFFSET: number,
    STROKE: number,
}

export default function BoardGrid({ COLS, ROWS, CELL, OFFSET, STROKE }: BoardGridProps) {
    const lines: React.ReactNode[] = []

    // horizontal
    for (let row = 0; row < ROWS; row++) {
        if (row == ROWS - 1) {
            lines.push(<line
                key={`${row}row1${Date.now().toString(20)}`}
                x1={OFFSET}
                y1={-OFFSET + CELL * row - STROKE}
                x2={-OFFSET + (ROWS - 1) * CELL}
                y2={-OFFSET + row * CELL - STROKE}
                stroke="black"
                strokeWidth={STROKE}
            />
            )
        } else {
            lines.push(<line
                key={`${row}row2${Date.now().toString(20)}`}
                x1={OFFSET}
                y1={OFFSET + CELL * row}
                x2={-OFFSET + (ROWS - 1) * CELL}
                y2={OFFSET + row * CELL}
                stroke="black"
                strokeWidth={STROKE}
            />
            )
        }
    }

    // vertical
    for (let col = 0; col < COLS; col++) {
        if (col == COLS - 1) {
            lines.push(<line
                key={`${col}col1${Date.now().toString(20)}`}
                x1={-OFFSET + CELL * col}
                y1={OFFSET}
                x2={-OFFSET + col * CELL}
                y2={-OFFSET + (COLS - 1) * CELL - STROKE}
                stroke="black"
                strokeWidth={STROKE}
            />
            )
        } else {
            lines.push(<line
                key={`${col}col2${Date.now().toString(20)}`}
                x1={OFFSET + CELL * col}
                y1={OFFSET}
                x2={OFFSET + col * CELL}
                y2={-OFFSET + (COLS - 1) * CELL - STROKE}
                stroke="black"
                strokeWidth={STROKE}
            />
            )
        }
    }

    // main cross
    lines.push(<line
        key={`mainCross1${Date.now().toString(20)}`}
        x1={OFFSET}
        y1={OFFSET}
        x2={(ROWS - 1) * CELL - STROKE - OFFSET + 1} // +1 and -1 are offset compensations
        y2={(ROWS - 1) * CELL - STROKE - OFFSET - 1}
        stroke="black"
        strokeWidth={STROKE}
    />
    )


    lines.push(<line
        key={`mainCross2${Date.now().toString(20)}`}
        x1={OFFSET}
        y1={(ROWS - 1) * CELL - STROKE - OFFSET - 1}
        x2={(ROWS - 1) * CELL - OFFSET + 1} // +1 and -1 are offset compensations
        y2={OFFSET}
        stroke="black"
        strokeWidth={STROKE}
    />
    )

    // sub cross

    lines.push(<line
        key={`subCross1${Date.now().toString(20)}`}
        x1={OFFSET}
        y1={OFFSET + (COLS - 2 - 1) * CELL}
        x2={OFFSET + (COLS - 2 - 1) * CELL}
        y2={OFFSET}
        stroke="black"
        strokeWidth={STROKE}
    />
    )

    lines.push(<line
        key={`subCross2${Date.now().toString(20)}`}
        x1={-OFFSET + (CELL * 2) + 2}
        y1={-OFFSET + (COLS - 2 - 1) * CELL + (CELL * 2) - 1}
        x2={-OFFSET + (COLS - 2 - 1) * CELL + (CELL * 2) + 1}
        y2={-OFFSET + (CELL * 2) + 1}
        stroke="black"
        strokeWidth={STROKE}
    />
    )

    lines.push(<line
        key={`subCross3${Date.now().toString(20)}`}
        x1={OFFSET}
        y1={OFFSET + (COLS - 2 - 1) * CELL}
        x2={-OFFSET + (CELL * 2) + 2}
        y2={-OFFSET + (COLS - 2 - 1) * CELL + (CELL * 2) - 1}
        stroke="black"
        strokeWidth={STROKE}
    />
    )

    lines.push(<line
        key={`subCross4${Date.now().toString(20)}`}
        x1={OFFSET + (COLS - 2 - 1) * CELL}
        y1={OFFSET}
        x2={-OFFSET + (COLS - 2 - 1) * CELL + (CELL * 2) + 1}
        y2={-OFFSET + (CELL * 2) + 1}
        stroke="black"
        strokeWidth={STROKE}
    />
    )


    return <>
        {
            lines
        }
    </>
}