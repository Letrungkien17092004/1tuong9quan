import { Socket, Namespace } from "socket.io";
import z from "zod";
import { GetPlayerByIdUsecase, FindOpponentUsecase, CreateMatchUsecase } from "../../core/usecases/index.js";

const PayloadSchema = z.object({
    playerId: z.string().min(1)
});


export default class FindMatchListener {
    private ioNamespace: Namespace
    private socket: Socket
    private eventName: string
    private getPlayerUsecase: GetPlayerByIdUsecase
    private findOpponentUsecase: FindOpponentUsecase
    private createMatchUsecase: CreateMatchUsecase

    constructor(options: {
        ioNamespace: Namespace,
        socket: Socket,
        eventName: string,
        getPlayerUsecase: GetPlayerByIdUsecase,
        findOpponentUsecase: FindOpponentUsecase,
        createMatchUsecase: CreateMatchUsecase
    }) {
        this.ioNamespace = options.ioNamespace
        this.socket = options.socket
        this.eventName = options.eventName
        this.getPlayerUsecase = options.getPlayerUsecase
        this.findOpponentUsecase = options.findOpponentUsecase
        this.createMatchUsecase = options.createMatchUsecase

    }

    listener = async (payload: unknown, callback: unknown) => {
        try {
            const validPayload = PayloadSchema.parse(payload);

            const player = await this.getPlayerUsecase.excute(validPayload.playerId)
            if (!player) {
                this.socket.emit(this.eventName, {
                    status: "error",
                    message: "Unauthorized"
                })

                if (typeof callback === "function") {
                    callback({ status: "success" });
                }
                return
            }

            const opponent = await this.findOpponentUsecase.excute({
                socketId: this.socket.id,
                playerId: validPayload.playerId
            })
            if (!opponent) {
                this.socket.emit(this.eventName, {
                    status: "ok",
                    message: "waiting"
                })

                if (typeof callback === "function") {
                    callback({ status: "success" });
                }
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

            if (typeof callback === "function") {
                callback({ status: "success" });
            }

        } catch (error) {

            if (error instanceof z.ZodError) {
                console.error("Validation Error:", error.cause);
                if (typeof callback === "function") {
                    return callback({
                        status: "error",
                        type: "VALIDATION_FAILED",
                        details: error.issues.map(e => e.message)
                    });
                }
            }
            console.error("System Error:", error);
            if (typeof callback === "function") {
                callback({
                    status: "error",
                    message: (error as Error).message
                });
            }
        }
    };
}