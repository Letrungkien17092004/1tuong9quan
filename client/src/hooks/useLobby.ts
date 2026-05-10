import { useCallback, useState } from "react";
import { socketService } from "../services";

type FindStatus = "waiting" | "match found"
type ConnnectStatus = "nothing" | "connected" | "connnect_error"

export default function useLobby() {
    const [connectStatus, setConnectStatus] = useState<ConnnectStatus>("nothing")
    const [matchId, setMatchId] = useState<string | undefined>(undefined)
    const [findStatus, setFindStatus] = useState<FindStatus | undefined>(undefined)

    const findMatch = useCallback(async (playerId: string) => {
        if (connectStatus === "nothing") {
            throw new Error("socket wasn't connected")
        }

        if (connectStatus === "connnect_error") {
            throw new Error("there is an error, can't find now")
        }
        const result = await socketService.findMatch({ playerId: playerId })
    }, [connectStatus])
}