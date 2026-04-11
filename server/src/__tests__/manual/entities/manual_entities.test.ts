import { Match, GameManager, GameEngine, Player } from "../../../core/entities/index.js";


const blue = new Player("p1", "player 1")
const green = new Player("p2", "player 2")

const match = new Match({ matchId: "m1" })
match.gameManager = new GameManager(blue.playerId, green.playerId)
match.bluePlayer = blue
match.greenPlayer = green
match.playerToSide.set(blue.playerId, "blue")
match.playerToSide.set(green.playerId, "green")
match.status = "playing"
match.bluePlayerStatus = "playing"
match.greenPlayerStatus = "playing"


const blueKingId = "piece_blue_17"
const greenKingId = "piece_green_2"

match.gameManager.performMove(blue.playerId, "piece_blue_12", "C1")
match.gameManager.performMove(green.playerId, "piece_green_7", "C3")
match.gameManager.performMove(blue.playerId, "piece_blue_17", "D1")
match.gameManager.performMove(green.playerId, "piece_green_2", "B3")
match.gameManager.perFormCapture(blue.playerId, blueKingId, "piece_green_6")
match.gameManager.perFormCapture(green.playerId, greenKingId, "piece_blue_13")
match.gameManager.performMove(blue.playerId, "piece_blue_16", "E2")
match.gameManager.performMove(green.playerId, "piece_green_9", "D1")
match.gameManager.perFormCapture(blue.playerId, blueKingId, "piece_green_9")
match.gameManager.performMove(green.playerId, "piece_green_5", "B1")
match.gameManager.perFormCapture(blue.playerId, blueKingId, "piece_green_5")
match.gameManager.performMove(green.playerId, "piece_green_7", "C2")
match.gameManager.performMove(blue.playerId, blueKingId, "B0")
match.gameManager.performMove(green.playerId, "piece_green_7", "D1")
match.gameManager.performMove(blue.playerId, blueKingId, "B1")
match.gameManager.performMove(green.playerId, "piece_green_3", "A2")
match.gameManager.perFormCapture(blue.playerId, blueKingId, "piece_green_7")
match.gameManager.performMove(green.playerId, "piece_green_1", "B1")
match.gameManager.perFormCapture(blue.playerId, blueKingId, "piece_green_1")
match.gameManager.performMove(green.playerId, greenKingId, "D2")
match.gameManager.performMove(blue.playerId, blueKingId, "B0")
match.gameManager.performMove(green.playerId, greenKingId, "D1")
match.gameManager.performMove(blue.playerId, blueKingId, "B1")
match.gameManager.performMove(green.playerId, "piece_green_3", "B2")
match.gameManager.perFormCapture(blue.playerId, blueKingId, greenKingId)



console.log(match.gameManager.getState())



















