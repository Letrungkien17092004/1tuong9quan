import { useCallback, useEffect, useState } from "react";
import { socketService } from "../services";
import type { MatchFindListenerPayload } from "../services/SocketService";

type FindStatus = "waiting" | "match found"

type UseLobbyReturnType = {
    findMatch: (playerId: string) => Promise<void>,
    findStatus: FindStatus | undefined,
    matchId: string | undefined
}
export default function useLobby(): UseLobbyReturnType {
    const [matchId, setMatchId] = useState<string | undefined>(undefined)
    const [findStatus, setFindStatus] = useState<FindStatus | undefined>(undefined)

    useEffect(() => {

        const listener = (payload: MatchFindListenerPayload) => {
            if (payload.status === "ok") {
                if (payload.message === "Waiting") {
                    setFindStatus("waiting")
                }

                if (payload.message === "Match found") {
                    setFindStatus("match found")
                    setMatchId(payload.matchId)
                }
            }
        }
        socketService.onFindMatch(listener)
        socketService.connect()

        return () => {
            socketService.offFindMatch(listener)
        }
    }, [])

    const findMatch = useCallback(async (playerId: string) => {
        await socketService.findMatch({ playerId: playerId })
    }, [socketService])


    return {
        findMatch: findMatch,
        findStatus,
        matchId
    }
}