import { IMatchRepository } from "../core/interface/repositories/index.js"
import { Player, GameManager, Match } from "../core/entities/index.js"

export default class MatchRepository implements IMatchRepository {
    private dataStore: Match[] = []

    async create(): Promise<Match> {
        const newMatch = new Match({
            matchId: crypto.randomUUID(),
        })
        this.dataStore.push(newMatch)
        return newMatch.clone()
    }

    async findById(matchId: string): Promise<Match | undefined> {
        const result = this.dataStore.find((item) => item.matchId === matchId)
        return result?.clone()
    }

    /**
     * Add player to match (join match), if both player have joined then create game manager and set status to "playing"
     * @param matchId 
     * @param player 
     * @returns 
     */
    async updatePlayer(matchId: string, player: Player): Promise<Match> {
        const match = this.dataStore.find((item) => item.matchId === matchId)
        if (!match) { throw new Error("match wasn't found") }

        // if player has join
        if (match.playerToSide.get(player.playerId)) {
            throw new Error("player has join")
        }

        
        if (!match.bluePlayer) {
            match.bluePlayer = player
            match.bluePlayerStatus = "joined"
            match.playerToSide.set(player.playerId, "blue")
        } else if (!match.greenPlayer) {
            match.greenPlayer = player
            match.greenPlayerStatus = "joined"
            match.playerToSide.set(player.playerId, "green")
        } else {
            throw new Error("Match is already full")
        }

        if (
            match.bluePlayer &&
            match.greenPlayer &&
            match.bluePlayerStatus === "joined" && 
            match.greenPlayerStatus === "joined"
        ) {
            // create gameManager when both player have joined
            const gameManager = new GameManager(match.bluePlayer.playerId, match.greenPlayer.playerId)
            match.gameManager = gameManager
            // set status to "playing"
            match.status = "playing"
            match.bluePlayerStatus = "playing"
            match.greenPlayerStatus = "playing"
        }
        
        return match.clone()
    }

    /**
     * update when a player disconnect
     */
    async setPlayerDisconnect(matchId: string, player: Player): Promise<Match> {
        const match = this.dataStore.find((item) => item.matchId === matchId)
        if (!match) { throw new Error("match wasn't found") }
        const sideOfPlayer = match.playerToSide.get(player.playerId)

        if (sideOfPlayer === "blue") {
            match.bluePlayerStatus = "disconnect"
            match.status = "anyone-disconnect"
        } else if (sideOfPlayer === "green") {
            match.greenPlayerStatus = "disconnect"
            match.status = "anyone-disconnect"
        } else {
            throw new Error("invalid player")
        }

        // if both player are disconnect then set match status to "break"
        if (match.bluePlayerStatus === "disconnect" && match.greenPlayerStatus === "disconnect") {
            match.status = "break"
        }

        return match.clone()
    }

    /**
     * retrives a ref of player in data store (it isn't clone)
     * @param matchId 
     * @returns 
     */
    async getReferrence(matchId: string): Promise<Match | undefined> {
        const result = this.dataStore.find((item) => item.matchId === matchId)
        return result

    }

    async delete(matchId: string): Promise<void> {
        const match = this.dataStore.some((item) => item.matchId === matchId)
        if (!match) { throw new Error("match wasn't found") }
        this.dataStore = this.dataStore.filter((item) => item.matchId !== matchId)
    }
}