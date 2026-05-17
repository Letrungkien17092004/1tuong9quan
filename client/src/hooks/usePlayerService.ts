import { useCallback, useMemo, useState, useEffect, useContext } from 'react';
import { playerService } from '../services';
import type { Player } from '../types';


export const usePlayerService = () => {
    const [player, setPlayer] = useState<Player | null>(null);

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