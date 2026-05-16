import type { Player } from '../types';



type CreateResponse = {
    player: {
        playerId: string,
        playerName: string
    }
}


type FindByIdResponse = {
    player: {
        playerId: string,
        playerName: string
    }
}


class PlayerService {
    private baseUrl: string;
    cacheData : {
        player?: Player
    } = {}
    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async create(): Promise<Player> {
        const response = await fetch(`${this.baseUrl}/api/player`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to create player');
        }

        const data = await response.json() as CreateResponse;
        const dataToSave = {
            playerId: data.player.playerId,
            playerName: data.player.playerName
        }
        document.cookie = `player=${JSON.stringify(dataToSave)}; path=/; max-age=86400`; // Lưu cookie 1 ngày
        return data.player;
    }

    async findById(id: string): Promise<Player> {
        const response = await fetch(`${this.baseUrl}/api/player/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to find player');
        }

        const data = await response.json() as FindByIdResponse

        return data.player;
    }

    readPlayerFromCookie(): Player | null {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'player') {
                try {
                    return JSON.parse(value);
                } catch {
                    return null;
                }
            }
        }
        return null;
    }

    updateCache(player: Player) {
        this.cacheData.player = {
            playerId: player.playerId,
            playerName: player.playerName
        }
    }

    clearCache() {
        this.cacheData = {}
    }
}

const playerService = new PlayerService("http://localhost:3000")

export default playerService;