import { useCallback, useMemo, useState, useEffect } from 'react';
import PlayerService from '../services/PlayerService';
import type { Player } from '../types';

const BASE_URL = 'http://localhost:3000'; // Thay đổi nếu cần, hoặc lấy từ env

export const usePlayerService = () => {
    const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
    const playerService = useMemo(() => new PlayerService(BASE_URL), []);

    useEffect(() => {
        const f = async () => {
            const playerFromCookie = playerService.readPlayerFromCookie();
            if (!playerFromCookie) { setCurrentPlayer(null) }
            else {
                const checkPlayerOnServer = await playerService.findById(playerFromCookie?.playerId)
                setCurrentPlayer(checkPlayerOnServer);
            }
        }
        f()
    }, [playerService]);

    const createPlayer = useCallback(async (): Promise<Player> => {
        const player = await playerService.create();
        setCurrentPlayer(player);
        return player;
    }, [playerService]);

    const findPlayerById = useCallback(async (id: string): Promise<Player> => {
        return await playerService.findById(id);
    }, [playerService]);

    const readPlayerFromCookie = useCallback(() => {
        const player = playerService.readPlayerFromCookie();
        setCurrentPlayer(player);
    }, [playerService]);

    return { currentPlayer, createPlayer, findPlayerById, readPlayerFromCookie };
};