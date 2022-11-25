import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { default as GameType, GameMode, GameState, UpdateGameDto } from '../../@Types/Game';
import { GamePlayer } from '../../@Types/GamePlayer';
import { gameState } from '../../atoms/gameAtom';
import WaitingRoomPlaylist from '../../components/WaitingRoomPlaylist/WaitingRoomPlaylist';
import gameService from '../../services/gameService';
import socketService from '../../services/socketService';

export default function Game() {
    const [game, setGame] = useRecoilState(gameState);

    const updateGame = (updateGameDto: UpdateGameDto) => {
        setGame((prevGame) => { return { ...prevGame, ...updateGameDto } });

        if (socketService.socket) {
            gameService.updateGame(socketService.socket, updateGameDto);
        }
    }

    const handleGameUpdate = () => {
        if (socketService.socket) {
            gameService.onGameUpdate(socketService.socket, (updateGameDto) => {
                setGame((prevGame) => { return { ...prevGame, ...updateGameDto } });
            });
        }
    }

    const handleJoinGameRoom = () => {
        if (socketService.socket) {
            gameService.onJoinGameRoom(socketService.socket, (gamePlayer: GamePlayer) => {
                setGame((prevGame) => { return { ...prevGame, gamePlayers: [...prevGame.gamePlayers, gamePlayer] } });
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

    useEffect(() => {
        handleGameUpdate();
        handleJoinGameRoom();
        handleLeaveGameRoom();

        return () => {
            if (socketService.socket) {
                gameService.leaveGameRoom(socketService.socket);
            }
        }
    }, []);

    if (!game) return <Navigate to="/" />

    console.log(game);

    return (
        <div>
            <h2>
                game
            </h2>

            <div>CODE: {game.joinCode}</div>
            <div>Game mode: {game.gameMode}</div>
            <div>Max player: {game.maxPlayers}</div>
            <div>Max suggestions: {game.maxSuggestions}</div>
            <div>Max questions: {game.maxQuestions}</div>

            <div>
                Players: {game.gamePlayers && game.gamePlayers.map((gamePlayer: GamePlayer) => {
                    return <div key={gamePlayer.userId}>{gamePlayer.userId}</div>
                })}
            </div>

            <WaitingRoomPlaylist updateGame={updateGame} />
        </div>
    );
}
