import z from "zod";
import { Handler } from "../types.js";
import { EventName } from "../eventName.js";
import {
    FindPlayerByIdUsecase,
    JoinMatchUsecase
} from "../../core/usecases/index.js";

const PayloadSchema = z.object({
    playerId: z.string(),
    matchId: z.string()
});

export const createJoinMatchHandler = (
    findPlayerByIdUsecase: FindPlayerByIdUsecase,
    joinMatchUsecase: JoinMatchUsecase
): Handler => {
    return async (context, payload, callback) => {
        try {
            if (typeof callback === "function") {
                callback({ status: "received" });
            }

            const validPayload = PayloadSchema.parse(payload);
            const player = await findPlayerByIdUsecase.execute(validPayload.playerId);

            if (!player) {
                throw new Error("player wasn't found");
            }

            const match = await joinMatchUsecase.execute(validPayload.matchId, player);
            context.socket.join(match.matchId);
            context.socket.emit(EventName.joinMatch, {
                status: "ok",
                message: "join successfuly",
                match_state: match.getState(),
                your_side: match.playerToSide.get(player.playerId)
            });

            // broadcast to other player
            context.socket.to(match.matchId).emit(EventName.changeState, {
                new_state: match.getState()
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                console.error("Validation Error:", error.cause);
                context.socket.emit(EventName.joinMatch, {
                    status: "error",
                    message: "VALIDATION_FAILED",
                    details: error.issues.map(e => e.message)
                });
                return;
            }

            if (error instanceof Error) {
                context.socket.emit(EventName.joinMatch, {
                    status: "error",
                    message: error.message
                });
                return;
            }

            context.socket.emit(EventName.joinMatch, {
                status: "error",
                message: "Unknown error",
                error: error
            });
        }
    };
};
