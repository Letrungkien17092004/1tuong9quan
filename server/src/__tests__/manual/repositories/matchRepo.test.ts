import { Player, GameManager, Match } from "../../../core/entities/index.js"
import MatchRepository from "../../../repositories/MatchRepository.js"

async function testMatchRepository() {
    const repo = new MatchRepository()

    console.log("=== Test MatchRepository ===")

    // Test create
    console.log("\n1. Test create match")
    const player1 = new Player("player1", "Player 1")
    const player2 = new Player("player2", "Player 2")
    const match = await repo.create({
        playerA: player1,
        playerB: player2,
        status: "pending-join"
    })
    console.log("Created match:", match)

    // Test findById
    console.log("\n2. Test findById")
    const foundMatch = await repo.findById(match.matchId)
    console.log("Found match:", foundMatch)

    const notFound = await repo.findById("nonexistent")
    console.log("Not found match:", notFound)

    // Test updatePlayer - join first player
    console.log("\n3. Test updatePlayer - join first player")
    const newPlayer = new Player("newPlayer", "New Player")
    const updatedMatch1 = await repo.updatePlayer(match.matchId, newPlayer)
    console.log("After joining first player:", updatedMatch1)

    // Test updatePlayer - join second player (should create gameManager)
    console.log("\n4. Test updatePlayer - join second player")
    const newPlayer2 = new Player("newPlayer2", "New Player 2")
    const updatedMatch2 = await repo.updatePlayer(match.matchId, newPlayer2)
    console.log("After joining second player:", updatedMatch2)
    console.log("GameManager created:", updatedMatch2.gameManager ? "Yes" : "No")
    console.log("Match status:", updatedMatch2.status)
    console.log("Blue player status:", updatedMatch2.bluePlayerStatus)
    console.log("Green player status:", updatedMatch2.greenPlayerStatus)

    // Test updatePlayer - try to join when full
    console.log("\n5. Test updatePlayer - try to join when full")
    const extraPlayer = new Player("extra", "Extra Player")
    try {
        await repo.updatePlayer(match.matchId, extraPlayer)
        console.log("ERROR: Should have thrown error")
    } catch (error) {
        console.log("Correctly threw error:", (error as Error).message)
    }

    // Test updatePlayer - try to join same player again
    console.log("\n6. Test updatePlayer - try to join same player again")
    try {
        await repo.updatePlayer(match.matchId, newPlayer)
        console.log("ERROR: Should have thrown error")
    } catch (error) {
        console.log("Correctly threw error:", (error as Error).message)
    }

    // Test delete
    console.log("\n7. Test delete")
    await repo.delete(match.matchId)
    const deletedMatch = await repo.findById(match.matchId)
    console.log("Match after delete:", deletedMatch)

    // Test delete non-existent
    console.log("\n8. Test delete non-existent")
    try {
        await repo.delete("nonexistent")
        console.log("ERROR: Should have thrown error")
    } catch (error) {
        console.log("Correctly threw error:", (error as Error).message)
    }

    console.log("\n=== Test completed ===")
}

// Run the test
testMatchRepository().catch(console.error)