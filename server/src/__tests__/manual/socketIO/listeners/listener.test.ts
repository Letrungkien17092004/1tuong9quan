import { Namespace, Socket } from "socket.io";
import MovePieceListener from "../../../../socketIO/listeners/MovePieceListener.js";
import FindPlayerByIdUsecase from "../../../../core/usecases/FindPlayerByIdUsecase.js";
import MovePieceUsecase from "../../../../core/usecases/MovePieceUsecase.js";
import Player from "../../../../core/entities/Player.js";
import Match from "../../../../core/entities/Match.js";

// Mock Namespace
const mockIoNsp = {
    to: function(room: string) {
        console.log(`Mock ioNsp.to called with room: ${room}`);
        return this;
    },
    emit: function(event: string, data: any) {
        console.log(`Mock ioNsp.emit called with event: ${event}, data:`, data);
    }
} as unknown as Namespace;

// Mock Socket
const mockSocket = {
    emit: function(event: string, data: any) {
        console.log(`Mock socket.emit called with event: ${event}, data:`, data);
    }
} as unknown as Socket;

// Mock FindPlayerByIdUsecase
const mockFindPlayerByIdUsecase = {
    excute: async function(playerId: string): Promise<Player | undefined> {
        console.log(`Mock FindPlayerByIdUsecase.excute called with playerId: ${playerId}`);
        if (playerId === "test-player-id") {
            return new Player("test-player-id", "Test Player");
        }
        return undefined;
    }
} as unknown as FindPlayerByIdUsecase;

// Mock MovePieceUsecase
const mockMovePieceUsecase = {
    excute: async function(matchId: string, playerId: string, targetPieceId: string, targetNodeId: string): Promise<Match> {
        console.log(`Mock MovePieceUsecase.excute called with matchId: ${matchId}, playerId: ${playerId}, targetPieceId: ${targetPieceId}, targetNodeId: ${targetNodeId}`);
        return new Match({
            matchId: matchId,
            status: "playing"
        });
    }
} as unknown as MovePieceUsecase;

// Create listener instance
const listener = new MovePieceListener({
    ioNsp: mockIoNsp,
    socket: mockSocket,
    findPlayerByIdUsecase: mockFindPlayerByIdUsecase,
    movePieceUsecase: mockMovePieceUsecase
});

// Test data
const testPayload = {
    matchId: "test-match-id",
    playerId: "test-player-id",
    targetPieceId: "test-piece-id",
    targetNodeId: "test-node-id"
};

// Mock callback
const mockCallback = function(data: any) {
    console.log("Mock callback called with data:", data);
};

// Run the test
console.log("Running MovePieceListener manual test...");

(async () => {
    try {
        await listener.listener(testPayload, mockCallback);
        console.log("Test completed successfully!");
    } catch (error) {
        console.error("Test failed:", error);
    }

    // Test invalid payload
    console.log("\nTesting invalid payload...");
    const invalidPayload = { invalid: "data" };
    try {
        await listener.listener(invalidPayload, mockCallback);
        console.log("Invalid payload test completed.");
    } catch (error) {
        console.error("Invalid payload test failed:", error);
    }

    // Test player not found
    console.log("\nTesting player not found...");
    const originalExcute = mockFindPlayerByIdUsecase.excute;
    mockFindPlayerByIdUsecase.excute = async function(playerId: string): Promise<Player | undefined> {
        console.log(`Mock FindPlayerByIdUsecase.excute called with playerId: ${playerId} (returning undefined)`);
        return undefined;
    };
    try {
        await listener.listener(testPayload, mockCallback);
        console.log("Player not found test completed.");
    } catch (error) {
        console.error("Player not found test failed:", error);
    }
    // Restore
    mockFindPlayerByIdUsecase.excute = originalExcute;
})();
