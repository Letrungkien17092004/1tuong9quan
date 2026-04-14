import RenderBoard from "../components/RenderBoard.tsx"
import { useCallback, useState, useEffect, useMemo, useRef } from "react"
import { useOfflineBoardManager } from "../hooks/index.ts"
import InGameHeader from "../components/InGameHeader.tsx"
import InGameMenu from "../components/InGameMenu.tsx"
import MatchInfo from "../components/MatchInfo.tsx"
import GameResultOverlay from "../components/GameResultOverlay.tsx"

type NodeToRender = {
    nodeId: string,
    row: number,
    column: number,
    pos: {
        x: number,
        y: number
    }
}

type PieceToRender = {
    pieceId: string,
    side: "blue" | "green",
    isKing: boolean,
    pos: {
        x: number,
        y: number
    },
    isClicked: boolean
}

type BoardSize = {
    cellSise: number,
    offset: number,
    width: number,
    height: number,
    stroke: number
}

// utils function
function convertPieceToXYPosition(nodesToRender: NodeToRender[], attachedNodeId: string) {
    const node = nodesToRender.find(nodeRd => nodeRd.nodeId === attachedNodeId)
    if (!node) { throw new Error("node was not found") }
    return node.pos

}

export default function PlayOffline() {
    const boardContainerRef = useRef<HTMLDivElement | null>(null)
    const [containerWidth, setContainerWidth] = useState(0)

    const gameEngine = useOfflineBoardManager()

    const [selectedId, setSelectedId] = useState<string | undefined>(undefined)
    const [currentTurn, setCurrentTurn] = useState<"blue" | "green">("blue")

    const boardSize = useMemo<BoardSize>(() => {
        const nodeCount = 5
        const reservedSpace = 32
        const minCellSize = 60
        const maxCellSize = 140
        const rawCellSize = containerWidth
            ? Math.floor((containerWidth - reservedSpace) / (nodeCount - 1))
            : 80
        const cellSize = Math.max(minCellSize, Math.min(maxCellSize, rawCellSize))
        const offset = Math.max(2, Math.round(cellSize * 0.05))
        const stroke = Math.max(1, Math.round(cellSize * 0.05))

        return {
            cellSise: cellSize,
            offset,
            width: (nodeCount - 1) * cellSize + offset * 2,
            height: (nodeCount - 1) * cellSize + offset * 2,
            stroke
        }
    }, [containerWidth])

    const nodesToRender = useMemo<NodeToRender[]>(() => {
        return gameEngine.nodes.map(node => ({
            nodeId: node.nodeId,
            row: node.row,
            column: node.col,
            pos: {
                x: node.col * boardSize.cellSise,
                y: node.row * boardSize.cellSise
            }
        }))
    }, [gameEngine.nodes, boardSize.cellSise])

    const piecesToRender = useMemo<PieceToRender[]>(() => {
        return gameEngine.pieces.map(piece => ({
            pieceId: piece.pieceId,
            side: piece.side,
            isKing: piece.isKing,
            isClicked: piece.pieceId === selectedId,
            pos: convertPieceToXYPosition(nodesToRender, piece.nodeId)
        }))
    }, [gameEngine.pieces, nodesToRender, selectedId])

    useEffect(() => {
        const element = boardContainerRef.current
        if (!element) { return }

        const updateWidth = () => setContainerWidth(element.clientWidth)
        updateWidth()

        const resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                setContainerWidth(entry.contentRect.width)
            }
        })

        resizeObserver.observe(element)
        return () => {
            resizeObserver.disconnect()
        }
    }, [])

    // event handler factory
    const createClickPieceEventHandler = useCallback((pieceId: string) => {
        return (e: React.MouseEvent) => {
            e.stopPropagation()
            e.preventDefault()
            console.log(`clicked to piece ${pieceId}`)

            const currentSelectPiece = gameEngine.getPieceById(pieceId)
            if (!currentSelectPiece) { throw new Error("invalid pieceId when click") }

            // handling once a piece has been selected
            if (selectedId) {
                // unclick piece
                if (selectedId === pieceId) {
                    setSelectedId(undefined)
                    return
                }
                const selectedPiece = gameEngine.getPieceById(selectedId)
                if (!selectedPiece) { throw new Error("selectedPiece was not found") }


                if (currentSelectPiece.side !== selectedPiece.side) {
                    if (
                        selectedPiece.isKing === true &&
                        gameEngine.canCapture(selectedId, currentSelectPiece.pieceId)
                    ) {
                        gameEngine.capture(selectedId, currentSelectPiece.pieceId)
                        setSelectedId(undefined)
                        // next turn
                        if (currentTurn === "blue") {
                            setCurrentTurn("green")
                        } else {
                            setCurrentTurn("blue")
                        }
                        return
                    }
                } else { // changer selected piece if click to same side
                    setSelectedId(currentSelectPiece.pieceId)
                }
                return
            }

            // handling once a piece hasn't been selected
            // can't click if game status isn't your turn
            if (currentSelectPiece.side !== currentTurn) { return }
            setSelectedId(currentSelectPiece.pieceId)
        }
    }, [
        selectedId,
        setSelectedId,
        gameEngine.canCapture,
        piecesToRender,
        gameEngine.getPieceById,
        currentTurn
    ])

    // event handler factory
    const createClickNodeEventHandler = useCallback((nodeId: string) => {
        return (e: React.MouseEvent) => {
            e.stopPropagation()
            e.preventDefault()
            console.log(`clicked to node ${nodeId}`)

            if (selectedId) {
                if (!gameEngine.canMove(selectedId, nodeId)) { return }
                gameEngine.move(selectedId, nodeId)
                setSelectedId(undefined)
                // next turn
                if (currentTurn === "blue") {
                    setCurrentTurn("green")
                } else {
                    setCurrentTurn("blue")
                }
                return
            }

        }
    }, [selectedId, gameEngine.canMove, gameEngine.move])

    // reset game event handler
    const onReset = useCallback((e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        gameEngine.reset()
        setCurrentTurn("blue")
    }, [gameEngine.reset])

    return (<>
        <div className="w-screen h-screen bg-[#050811]">
            <InGameHeader />
            <InGameMenu replayHandler={onReset} />
            <div className="grid grid-cols-12 p-10">
                <div className=" col-span-12 lg:col-span-2">
                    <MatchInfo
                        remainingBlue={gameEngine.remainingBlue}
                        remainingGreen={gameEngine.remainingGreen}
                        currentTurn={currentTurn}
                    />

                </div>
                <div className=" col-span-12 lg:col-span-10">
                    <div ref={boardContainerRef} className="w-full pt-10">
                        <RenderBoard
                            cellSize={boardSize.cellSise}
                            width={boardSize.width}
                            height={boardSize.height}
                            offset={boardSize.offset}
                            stroke={boardSize.stroke}
                            nodesToRender={nodesToRender}
                            piecesToRender={piecesToRender}
                            nodeClickFactory={createClickNodeEventHandler}
                            pieceClickFactory={createClickPieceEventHandler}
                        />
                    </div>
                </div>
            </div>

            {
                gameEngine.isDone &&
                gameEngine.winner &&
                <GameResultOverlay onReset={onReset} winner={gameEngine.winner} />
            }
        </div>
    </>)
}