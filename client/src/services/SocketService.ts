

import { io, Socket } from "socket.io-client";

export const EventName = {
    findMatch: "match:find",
    joinMatch: "match:join",
    movePiece: "match:move",
    capturePiece: "match:capture",
    changeState: "match:change-state"
} as const;

export type EventNameType = typeof EventName[keyof typeof EventName];

export interface EmitMatchFindPayload {
    playerId: string
}

export interface EmitMatchJoinPayload {
    playerId: string
    matchId: string
}

export interface EmitMatchMovePayload {
    playerId: string
    matchId: string
    targetPieceId: string
    targetNodeId: string
}

export interface EmitMatchCapturePayload {
    playerId: string
    matchId: string
    attackerId: string
    targetId: string
}

export interface MatchChangeStateListenerPayload {
    new_state: {
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
}

export type MatchFindListenerPayload = | {
    status: "ok",
    message: "Waiting" | "Match found"
} | {
    status: "error",
    message: string,
    details: any
}

export type MatchJoinListenerPayload = | {
    status: "error",
    message: string,
    details: any
} | {
    status: "ok",
    message: string
}

export default class SocketService {
    private socket: Socket | null = null
    private baseUrl: string
    private namespace: string
    private changeStateListeners = new Set<(payload: MatchChangeStateListenerPayload) => void>()
    private findMatchListeners = new Set<(payload: MatchFindListenerPayload) => void>()
    private joitMatchListeners = new Set<(payload: MatchJoinListenerPayload) => void>()

    constructor(baseUrl: string, options?: { namespace?: string; autoConnect?: boolean }) {
        this.baseUrl = baseUrl
        this.namespace = options?.namespace ?? "/match"

        if (options?.autoConnect ?? true) {
            this.connect()
        }
    }

    connect(): void {
        if (this.socket?.connected) {
            return
        }

        const trimmedBaseUrl = this.baseUrl.replace(/\/$/, "")
        const uri = `${trimmedBaseUrl}${this.namespace}`
        this.socket = io(uri, {
            autoConnect: true,
            transports: ["websocket"],
        })

        this.socket.on(EventName.changeState, (payload: MatchChangeStateListenerPayload) => {
            this.changeStateListeners.forEach((listener) => listener(payload))
        })

        this.socket.on(EventName.findMatch, (payload: MatchFindListenerPayload) => {
            this.findMatchListeners.forEach(listener => listener(payload))
        })

        this.socket.on(EventName.joinMatch, (payload: MatchJoinListenerPayload) => {
            this.joitMatchListeners.forEach(listener => listener(payload))
        })
    }

    disconnect(): void {
        if (!this.socket) {
            return
        }

        this.socket.off(EventName.changeState)
        this.socket.disconnect()
        this.socket = null
        this.changeStateListeners.clear()
    }

    onChangeState(listener: (payload: MatchChangeStateListenerPayload) => void): void {
        this.changeStateListeners.add(listener)
    }

    onFindMatch(listener: (payload: MatchFindListenerPayload) => void): void {
        this.findMatchListeners.add(listener)
    }

    onJoinMatch(listener: (payload: MatchJoinListenerPayload) => void): void {
        this.joitMatchListeners.add(listener)
    }

    private getSocket(): Socket {
        if (!this.socket) {
            throw new Error("SocketService is not connected. Call connect() before using socket methods.")
        }
        return this.socket
    } 


    private emitWithAck<TPayload, TResult>(eventName: EventNameType, payload: TPayload): Promise<TResult> {
        const socket = this.getSocket()

        return new Promise<TResult>((resolve, reject) => {
            socket.timeout(5000).emit(eventName, payload, (response: TResult) => {
                resolve(response)
            })
            setTimeout(() => {
                reject(new Error(`Socket emit timeout for event ${eventName}`))
            }, 6000)
        })
    }

    private async emit<TPayload>(eventName: EventNameType, payload: TPayload): Promise<void> {
        const socket = this.getSocket()

        socket.emit(eventName, payload)
    }

    async findMatch(payload: EmitMatchFindPayload): Promise<void> {
        await this.emit<EmitMatchFindPayload>(EventName.findMatch, payload)
    }

    async joinMatch(payload: EmitMatchJoinPayload): Promise<void> {
        await this.emit<EmitMatchJoinPayload>(EventName.joinMatch, payload)
    }

    async movePiece(payload: EmitMatchMovePayload): Promise<void> {
        await this.emit<EmitMatchMovePayload>(EventName.movePiece, payload)
    }

    async capturePiece(payload: EmitMatchCapturePayload): Promise<void> {
        await this.emit<EmitMatchCapturePayload>(EventName.capturePiece, payload)
    }
}
