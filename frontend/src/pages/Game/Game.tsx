import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { default as GameType, GameState } from '../../@Types/Game';
import { GamePlayer } from '../../@Types/GamePlayer';
import { authState } from '../../atoms/authAtom';
import { gameState } from '../../atoms/gameAtom';
import gameService from '../../services/gameService';
import socketService from '../../services/socketService';
import Playing from './Playing/Playing';
import Waiting from './Waiting/Waiting';
import { AudioPlayerProvider } from "react-use-audio-player"


export default function Game() {
    const [game, setGame] = useRecoilState(gameState);
    const auth = useRecoilValue(authState);

    const handleGameUpdate = () => {
        if (socketService.socket) {
            gameService.onGameUpdate(socketService.socket, (updateGameDto) => {
                console.log(updateGameDto)
                setGame((prevGame) => { return { ...prevGame, ...updateGameDto } });
            });
        }
    }

    const handleLeaveGameRoom = () => {
        if (socketService.socket) {
            gameService.onLeaveGameRoom(socketService.socket, (gamePlayerId: string) => {
                setGame((prevGame) => { return { ...prevGame, gamePlayers: prevGame.gamePlayers.filter((gp) => gp.id !== gamePlayerId) } });
            });
        }
    }

    const handleGameStart = () => {
        if (socketService.socket) {
            gameService.onStartGame(socketService.socket, (game: GameType) => {
                setGame(game);
            });
        }
    }

    useEffect(() => {
        if (!auth) return;

        handleGameUpdate();
        handleLeaveGameRoom();
        handleGameStart();

        return () => {
            if (socketService.socket) {
                gameService.leaveGameRoom(socketService.socket, auth.id);
            }
        }
    }, []);

    if (!game || !auth) return <Navigate to="/" />

    switch (game.state) {
        case GameState.WAITING:
            return <Waiting />;
        case GameState.PLAYING:
            return (
                <AudioPlayerProvider>
                    <Playing />
                </AudioPlayerProvider>
            );
        default:
            return <div>Loading..</div>
    }
}
