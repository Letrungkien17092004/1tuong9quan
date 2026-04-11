import { Socket, Namespace } from "socket.io";
import { FindPlayerByIdUsecase, JoinMatchUsecase } from "../../core/usecases";
import z from "zod";

const PayloadScheme = z.object({
    playerId: z.string(),
    matchId: z.string()
})

export default class JoinMatchListener {
    private ioNsp: Namespace
    private socket: Socket
    private eventName: string
    private findPlayerByIdUsecase: FindPlayerByIdUsecase
    private joinMatchUsecase: JoinMatchUsecase

    constructor(options: {
        ioNsp: Namespace,
        socket: Socket,
        eventName: string,
        findPlayerByIdUsecase: FindPlayerByIdUsecase,
        joinMatchUsecase: JoinMatchUsecase
    }) {
        this.ioNsp = options.ioNsp
        this.socket = options.socket
        this.eventName = options.eventName
        this.findPlayerByIdUsecase = options.findPlayerByIdUsecase
        this.joinMatchUsecase = options.joinMatchUsecase
    }

    listener = async (payload: unknown, callback: unknown): Promise<void> => {
        try {
            if (typeof callback === "function") {
                callback({
                    status: "received"
                })
            }

            const validPayload = PayloadScheme.parse(payload)
            const player = await this.findPlayerByIdUsecase.excute(validPayload.playerId)
            if (!player) {
                throw new Error("player wasn't found")
            }
            const match = await this.joinMatchUsecase.execute(validPayload.matchId, player)
            this.socket.join(match.matchId)
            this.socket.emit(this.eventName, {
                status: "ok",
                message: "join successfuly",
                match_state: match.getState(),
                your_side: match.playerToSide.get(player.playerId)
            })
            this.ioNsp.to(match.matchId).except(this.socket.id).emit(this.eventName, {
                match_state: match.getState()
            })
        } catch (error) {
            if (error instanceof z.ZodError) {
                console.error("Validation Error:", error.cause);
                this.socket.emit(this.eventName, {
                    status: "error",
                    type: "VALIDATION_FAILED",
                    details: error.issues.map(e => e.message)
                })
                return
            }

            if (error instanceof Error) {
                this.socket.emit(this.eventName, {
                    status: "error",
                    messsage: error.message
                })
                return
            }

            this.socket.emit(this.eventName, {
                status: "error",
                messsage: "unknow error",
                error: error
            })

        }
    }
}