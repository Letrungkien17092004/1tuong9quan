import { IMatchRepository } from "../core/interface/repositories/index.js"
import { Player, GameManager, Match } from "../core/entities/index.js"

export default class MatchRepository implements IMatchRepository {
    private dataStore: Match[] = []

    async create(options: {
        gameManager?: GameManager,
        playerA?: Player,
        playerB?: Player,
        status: "pending-join" | "playing" | "stop" | "done" | "break"
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

    async updatePlayer(
        matchId: string,
        players: {
            playerA?: Player,
            playerB?: Player,
        }
    ): Promise<void> {
        const match = this.dataStore.find((item) => item.matchId === matchId)
        if (!match) { throw new Error("match wasn't found") }
        match.playerA = players.playerA ? players.playerA : match.playerA
        match.playerB = players.playerB ? players.playerB : match.playerB
    }

    async updateStatus(
        matchId: string,
        status: "pending-join" | "playing" | "stop" | "done" | "break"
    ): Promise<void> {
        const match = this.dataStore.find((item) => item.matchId === matchId)
        if (!match) { throw new Error("match wasn't found") }
        match.status = status
    }

    async delete(matchId: string): Promise<void> {
        const match = this.dataStore.some((item) => item.matchId === matchId)
        if (!match) { throw new Error("match wasn't found") }
        this.dataStore = this.dataStore.filter((item) => item.matchId !== matchId)
    }
}