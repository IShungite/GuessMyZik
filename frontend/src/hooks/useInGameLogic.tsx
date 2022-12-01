import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import Game from '../@Types/Game';
import { GamePlayer } from '../@Types/GamePlayer';
import { authState } from '../atoms/authAtom';
import { gameStateAtom, isOwnerAtom } from '../atoms/gameAtom';
import gameService from '../services/gameService';
import socketService from '../services/socketService';
import useUpdateGame from './useUpdateGame';

export default function useInGameLogic() {
    const auth = useRecoilValue(authState);
    const { updateGame, removeGamePlayer, addGamePlayer } = useUpdateGame();

    const handleGameUpdate = () => {
        if (socketService.socket) {
            gameService.onGameUpdate(socketService.socket, (updateGameDto) => {
                console.log({ updateGameDto });
                updateGame(updateGameDto);
            });
        }
    }

    const handleLeaveGameRoom = () => {
        if (socketService.socket) {
            gameService.onLeaveGameRoom(socketService.socket, (gamePlayerId: string) => {
                removeGamePlayer(gamePlayerId);
            });
        }
    }

    const handleGameStart = () => {
        if (socketService.socket) {
            gameService.onStartGame(socketService.socket, (game: Game) => {
                updateGame(game);
            });
        }
    }

    const handleJoinGameRoom = () => {
        if (socketService.socket) {
            gameService.onJoinGameRoom(socketService.socket, (gamePlayer: GamePlayer) => {
                addGamePlayer(gamePlayer);
            });
        }
    }

    useEffect(() => {
        if (!auth) return;

        handleGameUpdate();
        handleLeaveGameRoom();
        handleGameStart();
        handleJoinGameRoom();

        return () => {
            if (socketService.socket) {
                gameService.leaveGameRoom(socketService.socket, auth.id);
            }
        }
    }, []);

    if (!auth) return <Navigate to="/" />

    return null;
}
