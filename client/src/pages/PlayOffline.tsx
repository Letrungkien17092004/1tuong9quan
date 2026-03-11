import RenderBoard from "../components/RenderBoard.tsx"
import { useCallback, useState, useEffect } from "react"
import { useOfflineBoardManager, useScreenSize } from "../hooks/index.ts"
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
    const width = useScreenSize()

    const [boardSize, setBoardSize] = useState<BoardSize>({
        cellSise: 0,
        offset: 0,
        width: 0,
        height: 0,
        stroke: 0
    })

    const gameEngine = useOfflineBoardManager()

    const [selectedId, setSelectedId] = useState<string | undefined>(undefined)
    const [currentTurn, setCurrentTurn] = useState<"blue" | "green">("blue")
    // init node to render
    const [nodesToRender, setNodesToRender] = useState<NodeToRender[]>(gameEngine.nodes.map(node => ({
        nodeId: node.nodeId,
        row: node.row,
        column: node.col,
        pos: {
            x: node.col * boardSize.cellSise,
            y: node.row * boardSize.cellSise
        }
    })))

    // init piece to render
    const [piecesToRender, setPiecesToRender] = useState<PieceToRender[]>(gameEngine.pieces.map(piece => ({
        pieceId: piece.pieceId,
        side: piece.side,
        isKing: piece.isKing,
        isClicked: piece.pieceId === selectedId,
        pos: convertPieceToXYPosition(nodesToRender, piece.nodeId)
    })))

    // resize board when device resize
    useEffect(() => {
        let cellSize = 80
        let offset = 2
        let stroke = 2
        // if (width < 431) {
        //     cellSize = 50
        //     offset = 50
        // }

        setBoardSize({
            cellSise: cellSize,
            offset: offset,
            width: (5 - 1) * cellSize + offset * 2,
            height: (5 - 1) * cellSize + offset * 2,
            stroke: stroke
        })
    }, [width])

    // refesh the positions of the nodes and pieces as boardSize changes
    useEffect(() => {
        setNodesToRender(prevNodes => {
            const newNodes = prevNodes.map((node) => {
                return {
                    nodeId: node.nodeId,
                    row: node.row,
                    column: node.column,
                    pos: {
                        x: node.column * boardSize.cellSise,
                        y: node.row * boardSize.cellSise
                    }
                }
            })
            return newNodes
        })
    }, [boardSize])

    // refesh piecesToRender when a piece is selected or moved
    useEffect(() => {
        setPiecesToRender(gameEngine.pieces.map(piece => ({
            pieceId: piece.pieceId,
            side: piece.side,
            isKing: piece.isKing,
            isClicked: piece.pieceId === selectedId,
            pos: convertPieceToXYPosition(nodesToRender, piece.nodeId)
        })))
    }, [gameEngine.pieces, selectedId, nodesToRender])

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
    return (<>
        <div className="w-screen h-screen bg-[#050811]">
            <InGameHeader />
            <InGameMenu />
            <MatchInfo
                remainingBlue={gameEngine.remainingBlue}
                remainingGreen={gameEngine.remainingGreen}
                currentTurn={currentTurn}
            />
            <div className="w-full pt-10">
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

            {
                gameEngine.isDone && gameEngine.winner && <GameResultOverlay winner={gameEngine.winner}/>
            }

                {/* <GameResultOverlay winner={"blue"}/> */}
        </div>
    </>)
}