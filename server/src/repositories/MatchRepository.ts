import { IMatchRepository } from "../core/interface/repositories/index.js"
import { Player, GameManager, Match } from "../core/entities/index.js"

export default class MatchRepository implements IMatchRepository {
    private dataStore: Match[] = []

    async create(options: {
        gameManager?: GameManager,
        playerA?: Player,
        playerB?: Player,
        status: "pending-join" | "playing" | "anyone-disconnect" | "done" | "break"
    }): Promise<Match> {
        const newMatch = new Match({
            matchId: crypto.randomUUID(),
            ...options
        })
        this.dataStore.push(newMatch)
        return newMatch.clone()
    }

    async findById(matchId: string): Promise<Match | undefined> {
        const result = this.dataStore.find((item) => item.matchId === matchId)
        return result?.clone()
    }

    async update(matchId: string, data: {
        gameManager?: GameManager,
        bluePlayer?: Player,
        greenPlayer?: Player,
        status?: "pending-join" | "playing" | "anyone-disconnect" | "done" | "break",
        bluePlayerStatus?: "pending-join" | "joined" | "playing" | "disconnect",
        greenPlayerStatus?: "pending-join" | "joined" | "playing" | "disconnect"
    }): Promise<Match> {
        const match = this.dataStore.find((item) => item.matchId === matchId)
        if (!match) { throw new Error("match wasn't found") }

        console.log("update match")
        console.log("data to update: ", data)
        console.log("match before update: ", match)
        
        if (data.gameManager !== undefined) match.gameManager = data.gameManager
        if (data.bluePlayer !== undefined) {
            match.bluePlayer = data.bluePlayer
            match.playerToSide.set(data.bluePlayer.playerId, "blue")
        }
        if (data.greenPlayer !== undefined) {
            match.greenPlayer = data.greenPlayer
            match.playerToSide.set(data.greenPlayer.playerId, "green")
        }
        if (data.status !== undefined) match.status = data.status
        if (data.bluePlayerStatus !== undefined) match.bluePlayerStatus = data.bluePlayerStatus
        if (data.greenPlayerStatus !== undefined) match.greenPlayerStatus = data.greenPlayerStatus
        console.log("match after update: ", match)
        
        return match.clone()
    }

    async delete(matchId: string): Promise<void> {
        const match = this.dataStore.some((item) => item.matchId === matchId)
        if (!match) { throw new Error("match wasn't found") }
        this.dataStore = this.dataStore.filter((item) => item.matchId !== matchId)
    }
}