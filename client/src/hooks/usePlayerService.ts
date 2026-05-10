import { useCallback, useMemo, useState, useEffect, useContext } from 'react';
import { PlayerService } from '../services';
import type { Player } from '../types';

const BASE_URL = 'http://localhost:3000'; // Thay đổi nếu cần, hoặc lấy từ env

export const usePlayerService = () => {
    const [player, setPlayer] = useState<Player | null>(null);
    const playerService = useMemo(() => new PlayerService(BASE_URL), []);

    const createPlayer = useCallback(async (): Promise<Player> => {
        return await playerService.create();
    }, [playerService]);

    const findPlayerById = useCallback(async (id: string): Promise<Player> => {
        return await playerService.findById(id);
    }, [playerService]);

    const readPlayerFromCookie = useCallback(() => {
        return playerService.readPlayerFromCookie();
    }, [playerService]);

    return { player, createPlayer, findPlayerById, readPlayerFromCookie, setPlayer };
};