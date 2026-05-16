import { useLoaderData, useParams } from "react-router-dom"
import { playerService } from "../services"
import { usePlayOnline, useOnlineEngine } from "../hooks"
import { useEffect, useRef, useState, useMemo, useCallback } from "react"
import RenderBoard from "../components/RenderBoard.tsx"


type BoardSize = {
    cellSise: number,
    offset: number,
    width: number,
    height: number,
    stroke: number
}

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

// utils function
function convertPieceToXYPosition(nodesToRender: NodeToRender[], attachedNodeId: string) {
    const node = nodesToRender.find(nodeRd => nodeRd.nodeId === attachedNodeId)
    if (!node) { throw new Error("node was not found") }
    return node.pos

}


export async function playerLoader() {
    const playerCache = playerService.cacheData.player
    if (playerCache) {
        return playerCache
    }
    const player = playerService.readPlayerFromCookie()
    if (player) {
        const validPlayer = await playerService.findById(player.playerId)
        if (validPlayer) {
            playerService.updateCache(validPlayer)
            return validPlayer
        }
    }

    const createdPlayer = await playerService.create()
    playerService.updateCache(createdPlayer)
    return createdPlayer
}


export default function PlayOnline() {
    const player = useLoaderData() as { playerId: string, playerName: string }
    const { matchId } = useParams() as { matchId: string }
    const { joiMatch, matchState } = usePlayOnline()

    const boardContainerRef = useRef<HTMLDivElement | null>(null)
    const [selectedId, setSelectedId] = useState<string>("")
    const [containerWidth, setContainerWidth] = useState(0)
    const { nodes, pieces, setMatchState, yourSide, remainingPiece, currentTurn, summaryStatus } = useOnlineEngine()
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
        return nodes.map(node => ({
            nodeId: node.nodeId,
            row: node.row,
            column: node.col,
            pos: {
                x: node.col * boardSize.cellSise,
                y: node.row * boardSize.cellSise
            }
        }))
    }, [nodes, boardSize.cellSise])

    const piecesToRender = useMemo<PieceToRender[]>(() => {
        return pieces.map(piece => ({
            pieceId: piece.pieceId,
            side: piece.side,
            isKing: piece.isKing,
            isClicked: piece.pieceId === selectedId,
            pos: convertPieceToXYPosition(nodesToRender, piece.nodeId)
        }))
    }, [pieces, selectedId])


    const clickNodeEventFactory = useCallback((nodeId: string) => {
        return (e: React.MouseEvent) => {
            e.stopPropagation()
            console.log("click nodeId: ", nodeId)
        }
    }, [])

    const clickPieceEventFactory = useCallback((pieceId: string) => {
        return (e: React.MouseEvent) => {
            e.stopPropagation()
            if (!selectedId) {
                setSelectedId(pieceId)
                return
            }
            console.log("click pieceId: ", pieceId)
        }
    }, [selectedId])

    useEffect(() => {
        joiMatch(player.playerId, matchId)
    }, [])

    useEffect(() => {
        setMatchState(matchState)
    }, [matchState])

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


    return (

        <div className="min-h-screen bg-[#050811] flex flex-col">
            <div className="w-full grid grid-cols-12">
                {/* sidebar */}
                <div className="col-span-3">
                    <div className="w-full h-screen p-3">
                        <h3 className="text-md text-white font-bold">Thông tin trận đấu</h3>

                        {!matchState && <span className="text-white">Đợi vào trận...</span>}
                        {matchState && !matchState.gameManagerState && <span className="text-white">Đợi đối phương vào trận...</span>}


                        {/* side info */}
                        <div className="w-full">
                            <span className="text-white">Phe: </span>
                            {
                                yourSide === "green"
                                    ? <span className=" text-green-400">green</span>
                                    : <span className=" text-blue-400">blue</span>
                            }
                        </div>

                        {/* piece info */}
                        <div className="w-full">
                            <div className="w-full">
                                <span className="text-white">Quân green còn lại: </span>
                                <span className=" text-green-400">{remainingPiece.green}</span>
                            </div>
                            <div className="w-full">
                                <span className="text-white">Quân blue còn lại: </span>
                                <span className=" text-blue-400">{remainingPiece.blue}</span>
                            </div>
                        </div>

                        {/* turn info */}
                        <div className="w-full">
                            <span className="text-white">Lượt đi hiện tại: </span>
                            {
                                currentTurn === "green"
                                    ? <span className=" text-green-400">green</span>
                                    : <span className=" text-blue-400">blue</span>
                            }

                        </div>

                        <h3 className="text-md text-white font-bold">Thông tin trạng thái</h3>
                        {/* player info */}
                        <div className="w-full">
                            <div className="w-full">
                                <span className="text-white">Trạng thái green player: </span>
                                <span className=" text-green-400">{summaryStatus.greenPlayerStatus}</span>
                            </div>
                            <div className="w-full">
                                <span className="text-white">Trạng thái blue player: </span>
                                <span className=" text-blue-400">{summaryStatus.bluePlayerStatus}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* board */}
                <div className="col-span-9">
                    <div className="w-full h-screen flex items-center justify-center">

                        {/* board container */}
                        <div className="w-full">
                            <RenderBoard
                                cellSize={boardSize.cellSise}
                                width={boardSize.width}
                                height={boardSize.height}
                                offset={boardSize.offset}
                                stroke={boardSize.stroke}
                                nodesToRender={nodesToRender}
                                piecesToRender={piecesToRender}
                                nodeClickFactory={clickNodeEventFactory}
                                pieceClickFactory={clickPieceEventFactory}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}