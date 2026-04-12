import { Socket, Namespace } from "socket.io";
import { FindPlayerByIdUsecase, CapturePieceUsecase } from "../../core/usecases";
import { EventName } from "../sockets/eventName";
import z from "zod";

const PayloadScheme = z.object({
    matchId: z.string(),
    playerId: z.string(),
    attackerId: z.string(),
    targetId: z.string()
})

export default class CapturePieceListener {
    private ioNsp: Namespace
    private socket: Socket
    private findPlayerByIdUsecase: FindPlayerByIdUsecase
    private capturePieceUsecase: CapturePieceUsecase

    constructor(options: {
        ioNsp: Namespace,
        socket: Socket,
        findPlayerByIdUsecase: FindPlayerByIdUsecase,
        capturePieceUsecase: CapturePieceUsecase
    }) {
        this.ioNsp = options.ioNsp
        this.socket = options.socket
        this.findPlayerByIdUsecase = options.findPlayerByIdUsecase
        this.capturePieceUsecase = options.capturePieceUsecase
    }

    listener = async (payload: unknown, callback: unknown): Promise<void> => {
        try {
            if (typeof callback === "function") {
                callback({
                    status: "received"
                })
            }

            const validPayload = PayloadScheme.parse(payload)
            const player = await this.findPlayerByIdUsecase.execute(validPayload.playerId)
            if (!player) {
                throw new Error("player wasn't found")
            }

            const matchAfterCapture = await this.capturePieceUsecase.execute(
                validPayload.matchId, 
                player.playerId, 
                validPayload.attackerId,
                validPayload.targetId
            )

            this.ioNsp.to(matchAfterCapture.matchId).emit(EventName.changeState, {
                new_state: matchAfterCapture.getState()
            })

        } catch (error) {
            if (error instanceof z.ZodError) {
                console.error("Validation Error:", error.cause);
                this.socket.emit(EventName.capturePiece, {
                    status: "error",
                    type: "VALIDATION_FAILED",
                    details: error.issues.map(e => e.message)
                })
                return
            }

            if (error instanceof Error) {
                this.socket.emit(EventName.capturePiece, {
                    status: "error",
                    messsage: error.message
                })
                return
            }

            this.socket.emit(EventName.capturePiece, {
                status: "error",
                messsage: "unknow error",
                error: error
            })

        }
    }
}