import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { default as GameType, GameMode, GameState, UpdateGameDto } from '../../@Types/Game';
import { GamePlayer } from '../../@Types/GamePlayer';
import { authState } from '../../atoms/authAtom';
import { gameState } from '../../atoms/gameAtom';
import WaitingRoomPlaylist from '../../components/WaitingRoomPlaylist/WaitingRoomPlaylist';
import gameService from '../../services/gameService';
import socketService from '../../services/socketService';

export default function Game() {
    const [game, setGame] = useRecoilState(gameState);
    const auth = useRecoilValue(authState);

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
        if (!auth) return;

        handleGameUpdate();
        handleJoinGameRoom();
        handleLeaveGameRoom();

        return () => {
            if (socketService.socket) {
                gameService.leaveGameRoom(socketService.socket, auth.id);
            }
        }
    }, []);

    if (!game || !auth) return <Navigate to="/" />

    console.log(game);

    const isOwner = game.gamePlayers.find((gp) => gp.isOwner && gp.userId === auth.id)

    return (
        <div>
            <div className='text-center font-bold text-xl mb-5'>Join code: {game.joinCode}</div>

            <div className='flex justify-between'>
                <div>
                    <div className='underline mb-2'>Settings:</div>
                    <div className='ml-5'>
                        <div>Game mode: {game.gameMode}</div>
                        <div>Max player: {game.maxPlayers}</div>
                        <div>Max suggestions: {game.maxSuggestions}</div>
                        <div>Max questions: {game.maxQuestions}</div>
                    </div>
                </div>

                <div className='text-center'>
                    <WaitingRoomPlaylist updateGame={updateGame} />
                </div>

                <div>
                    <div className='underline mb-2'>Settings:</div>
                    <div className='ml-5'>
                        {game.gamePlayers && game.gamePlayers.map((gamePlayer: GamePlayer) => {
                            return <div key={gamePlayer.userId}>{gamePlayer.userId}</div>
                        })}
                    </div>
                </div>
            </div>

            {isOwner && <div>You are the owner of the game!</div>}

        </div>
    );
}
