import { Socket, Namespace } from "socket.io";
import z from "zod";
import { FindPlayerByIdUsecase, FindOpponentOrPushToQueueUsecase, CreateMatchUsecase } from "../../core/usecases/index.js";
import { EventName } from "../sockets/eventName.js";
const PayloadSchema = z.object({
    playerId: z.string().min(1)
});


export default class FindMatchListener {
    private ioNamespace: Namespace
    private socket: Socket
    private findPlayerByIdUsecase: FindPlayerByIdUsecase
    private findOpponentOrPushToQueueUsecase: FindOpponentOrPushToQueueUsecase
    private createMatchUsecase: CreateMatchUsecase

    constructor(options: {
        ioNamespace: Namespace,
        socket: Socket,
        findPlayerByIdUsecase: FindPlayerByIdUsecase,
        findOpponentOrPushToQueueUsecase: FindOpponentOrPushToQueueUsecase,
        createMatchUsecase: CreateMatchUsecase
    }) {
        this.ioNamespace = options.ioNamespace
        this.socket = options.socket
        this.findPlayerByIdUsecase = options.findPlayerByIdUsecase
        this.findOpponentOrPushToQueueUsecase = options.findOpponentOrPushToQueueUsecase
        this.createMatchUsecase = options.createMatchUsecase

    }

    listener = async (payload: unknown, callback: unknown) => {
        try {
            if (typeof callback === "function") {
                callback({ status: "received" });
            }
            const validPayload = PayloadSchema.parse(payload);

            const player = await this.findPlayerByIdUsecase.execute(validPayload.playerId)
            if (!player) {
                this.socket.emit(EventName.findMatch, {
                    status: "error",
                    message: "Unauthorized"
                })

                return
            }

            const opponent = await this.findOpponentOrPushToQueueUsecase.execute({
                socketId: this.socket.id,
                playerId: validPayload.playerId
            })
            if (!opponent) {
                this.socket.emit(EventName.findMatch, {
                    status: "ok",
                    message: "Waiting"
                })
                return
            }

            const match = await this.createMatchUsecase.execute()
            this.socket.emit(
                EventName.findMatch,
                {
                    status: "ok",
                    message: "Match found",
                    matchId: match.matchId
                }
            )
            this.ioNamespace.to(opponent.socketId).emit(
                EventName.findMatch,
                {
                    status: "ok",
                    message: "Match found",
                    matchId: match.matchId
                }
            )

        } catch (error) {

            if (error instanceof z.ZodError) {
                console.error("Validation Error:", error.cause);
                this.socket.emit(EventName.findMatch, {
                    status: "error",
                    message: "VALIDATION_FAILED",
                    details: error.issues.map(e => e.message)
                })

                return
            }

            if (error instanceof Error) {
                this.socket.emit(EventName.findMatch, {
                    status: "error",
                    messsage: error.message
                })
                return
            }

            this.socket.emit(EventName.findMatch, {
                status: "error",
                messsage: "unknow error",
                error: error
            })
        }
    };
}