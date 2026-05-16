import { useCallback, useEffect, useState } from "react";
import { socketService } from "../services";
import type { MatchJoinListenerPayload, MatchChangeStateListenerPayload } from "../services/SocketService"


type MatchState = {
    yourSide: "blue" | "green",
    status: "pending-join" | "playing" | "anyone-disconnect" | "done" | "break",
    bluePlayerStatus: "pending-join" | "joined" | "playing" | "disconnect",
    greenPlayerStatus: "pending-join" | "joined" | "playing" | "disconnect",
    gameManagerState?: {
        pieces: {
            pieceId: string
            side: "green" | "blue"
            isKing: boolean
            nodeId: string
        }[],
        currentTurn: "blue" | "green",
        remainingBluePiece: number,
        remainingGreenPiece: number,
        winner?: "blue" | "green"
    }
}


type UsePlayOnlineReturnType = {
    matchState: MatchState | undefined,
    joiMatch: (playerId: string, matchId: string) => Promise<void>,
    move: (playerId: string, matchId: string, targetPieceId: string, targetNodeId: string) => Promise<void>,
    capture: (playerId: string, matchId: string, attackerId: string, targetId: string) => Promise<void>
}


export default function usePlayOnline(): UsePlayOnlineReturnType {
    const [matchState, setMatchState] = useState<MatchState | undefined>(undefined)


    useEffect(() => {
        var isMounted = true

        const joinlistener = (payload: MatchJoinListenerPayload) => {
            if (isMounted === false) { return }
            if (payload.status === "ok") {
                setMatchState({
                    ...payload.match_state,
                    yourSide: payload.your_side
                })
            }
        }

        const changeStateListener = (payload: MatchChangeStateListenerPayload) => {
            if (isMounted === false) { return }
            setMatchState(prev => {
                return {
                    yourSide: prev?.yourSide || "blue",
                    ...payload.new_state
                }
            })
        }
        socketService.connect()
        socketService.onJoinMatch(joinlistener)
        socketService.onChangeState(changeStateListener)

        return () => {
            isMounted = false
            socketService.offJoinMatch(joinlistener)
            socketService.offChangeState(changeStateListener)
        }
    }, [])


    const joinMatch = useCallback(async (playerId: string, matchId: string) => {
        await socketService.joinMatch({
            playerId: playerId,
            matchId: matchId
        })
    }, [socketService.joinMatch])

    const move = useCallback(async (playerId: string, matchId: string, targetPieceId: string, targetNodeId: string) => {
        await socketService.movePiece({
            playerId,
            matchId,
            targetPieceId,
            targetNodeId
        })
    }, [socketService.movePiece])

    const capture = useCallback(async (playerId: string, matchId: string, attackerId: string, targetId: string) => {
        await socketService.capturePiece({
            playerId,
            matchId,
            attackerId,
            targetId
        })
    }, [socketService.capturePiece])

    return {
        matchState: matchState,
        joiMatch: joinMatch,
        move: move,
        capture: capture
    }
}