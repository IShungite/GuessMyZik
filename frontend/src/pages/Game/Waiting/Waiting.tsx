import { Button } from 'flowbite-react';
import React, { useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil';
import { UpdateGameDto } from '../../../@Types/Game';
import { GamePlayer } from '../../../@Types/GamePlayer';
import { authState } from '../../../atoms/authAtom';
import { gameState } from '../../../atoms/gameAtom';
import WaitingRoomPlaylist from '../../../components/WaitingRoomPlaylist/WaitingRoomPlaylist';
import WaitingRoomSuggestion from '../../../components/WaitingRoomSuggestion/WaitingRoomSuggestion';
import gameService from '../../../services/gameService';
import socketService from '../../../services/socketService';

export default function Waiting() {
    const [game, setGame] = useRecoilState(gameState);
    const auth = useRecoilValue(authState);

    const updateGame = (updateGameDto: UpdateGameDto) => {
        setGame((prevGame) => { return { ...prevGame, ...updateGameDto } });

        if (socketService.socket) {
            gameService.updateGame(socketService.socket, updateGameDto);
        }
    }

    const handleJoinGameRoom = () => {
        if (socketService.socket) {
            gameService.onJoinGameRoom(socketService.socket, (gamePlayer: GamePlayer) => {
                console.log(gamePlayer)
                setGame((prevGame) => { return { ...prevGame, gamePlayers: [...prevGame.gamePlayers, gamePlayer] } });
            });
        }
    }

    const handleClickPlay = () => {
        if (socketService.socket) {
            gameService.startGame(socketService.socket)
        }
    }

    useEffect(() => {
        handleJoinGameRoom();
    }, []);


    if (!game || !auth) return null;

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
                        <WaitingRoomSuggestion updateGame={updateGame} />
                        <div>Max questions: {game.maxQuestions}</div>
                    </div>
                </div>

                <div className='text-center'>
                    <WaitingRoomPlaylist updateGame={updateGame} />
                </div>

                <div>
                    <div className='underline mb-2'>Players:</div>
                    <div className='ml-5'>
                        {game.gamePlayers && game.gamePlayers.map((gamePlayer: GamePlayer) => {
                            return <div key={gamePlayer.userId}>{gamePlayer.userId}</div>
                        })}
                    </div>
                </div>
            </div>

            {isOwner && <Button onClick={handleClickPlay} >Play!</Button>}
        </div>
    )
}
