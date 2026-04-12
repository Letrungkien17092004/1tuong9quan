import { Socket, Namespace } from "socket.io";
import { FindPlayerByIdUsecase, MovePieceUsecase } from "../../core/usecases";
import { EventName } from "../sockets/eventName";
import z from "zod";

const PayloadScheme = z.object({
    matchId: z.string(),
    playerId: z.string(),
    targetPieceId: z.string(),
    targetNodeId: z.string()
})

export default class MovePieceListener {
    private ioNsp: Namespace
    private socket: Socket
    private findPlayerByIdUsecase: FindPlayerByIdUsecase
    private movePieceUsecase: MovePieceUsecase

    constructor(options: {
        ioNsp: Namespace,
        socket: Socket,
        findPlayerByIdUsecase: FindPlayerByIdUsecase,
        movePieceUsecase: MovePieceUsecase
    }) {
        this.ioNsp = options.ioNsp
        this.socket = options.socket
        this.findPlayerByIdUsecase = options.findPlayerByIdUsecase
        this.movePieceUsecase = options.movePieceUsecase
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

            const matchAfterMove = await this.movePieceUsecase.execute(
                validPayload.matchId, 
                player.playerId, 
                validPayload.targetPieceId,
                validPayload.targetNodeId
            )

            this.ioNsp.to(matchAfterMove.matchId).emit(EventName.changeState, {
                new_state: matchAfterMove.getState()
            })

        } catch (error) {
            if (error instanceof z.ZodError) {
                console.error("Validation Error:", error.cause);
                this.socket.emit(EventName.movePiece, {
                    status: "error",
                    type: "VALIDATION_FAILED",
                    details: error.issues.map(e => e.message)
                })
                return
            }

            if (error instanceof Error) {
                this.socket.emit(EventName.movePiece, {
                    status: "error",
                    messsage: error.message
                })
                return
            }

            this.socket.emit(EventName.movePiece, {
                status: "error",
                messsage: "unknow error",
                error: error
            })

        }
    }
}