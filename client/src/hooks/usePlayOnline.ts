import { useCallback, useState } from "react";
import { socketService } from "../services";

type ConnectStatus = "nothing" | "connected" | "connect_error"

type PiecesState = {
    pieceId: string
    side: "green" | "blue"
    isKing: boolean
    nodeId: string
}[]

type MatchState = {
    yourSide: "blue" | "green",
    matchStatus: "pending-join" | "playing" | "anyone-disconnect" | "done" | "break",
    bluePlayerStatus: "pending-join" | "joined" | "playing" | "disconnect",
    greenPlayerStatus: "pending-join" | "joined" | "playing" | "disconnect",
    pieces: PiecesState
}



export default function usePlayOnline() {
    const [connectStatus, setConnectStatus] = useState<ConnectStatus>("nothing")
    const [matchState, setMatchState] = useState<MatchState | undefined>(undefined)

}