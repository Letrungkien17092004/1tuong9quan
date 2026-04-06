import { Socket, Namespace } from "socket.io";
import z from "zod";
import { FindPlayerByIdUsecase, FindOpponentOrPushToQueueUsecase, CreateMatchUsecase } from "../../core/usecases/index.js";

const PayloadSchema = z.object({
    playerId: z.string().min(1)
});


export default class FindMatchListener {
    private ioNamespace: Namespace
    private socket: Socket
    private eventName: string
    private findPlayerByIdUsecase: FindPlayerByIdUsecase
    private findOpponentOrPushToQueueUsecase: FindOpponentOrPushToQueueUsecase
    private createMatchUsecase: CreateMatchUsecase

    constructor(options: {
        ioNamespace: Namespace,
        socket: Socket,
        eventName: string,
        findPlayerByIdUsecase: FindPlayerByIdUsecase,
        findOpponentOrPushToQueueUsecase: FindOpponentOrPushToQueueUsecase,
        createMatchUsecase: CreateMatchUsecase
    }) {
        this.ioNamespace = options.ioNamespace
        this.socket = options.socket
        this.eventName = options.eventName
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

            const player = await this.findPlayerByIdUsecase.excute(validPayload.playerId)
            if (!player) {
                this.socket.emit(this.eventName, {
                    status: "error",
                    message: "Unauthorized"
                })

                return
            }

            const opponent = await this.findOpponentOrPushToQueueUsecase.excute({
                socketId: this.socket.id,
                playerId: validPayload.playerId
            })
            if (!opponent) {
                this.socket.emit(this.eventName, {
                    status: "ok",
                    message: "waiting"
                })
                return
            }

            const match = await this.createMatchUsecase.excute()
            this.socket.emit(
                this.eventName,
                {
                    status: "ok",
                    message: "match found",
                    matchId: match.matchId
                }
            )
            this.ioNamespace.to(opponent.socketId).emit(
                this.eventName,
                {
                    status: "ok",
                    message: "match found",
                    matchId: match.matchId
                }
            )

        } catch (error) {

            if (error instanceof z.ZodError) {
                console.error("Validation Error:", error.cause);
                if (typeof callback === "function") {
                    callback({
                        status: "error",
                        type: "VALIDATION_FAILED",
                        details: error.issues.map(e => e.message)
                    });
                }

                return
            }

            if (error instanceof Error) {
                this.socket.emit(this.eventName, {
                    message: error.message
                })
                return
            }
            this.socket.emit(this.eventName, {
                message: "unknow error",
                error: error
            })
        }
    };
}