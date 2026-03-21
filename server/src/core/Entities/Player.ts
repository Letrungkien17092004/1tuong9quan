

export default class Player {
    playerId: string
    playerName: string

    constructor(playerId: string, playerName: string) {
        this.playerId = playerId
        this.playerName = playerName
    };

    clone(): Player {
        const copy = new Player(this.playerId, this.playerName)
        return copy
    }
}