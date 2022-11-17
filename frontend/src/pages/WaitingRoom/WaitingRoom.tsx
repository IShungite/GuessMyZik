import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil'
import { gameState } from '../../atoms/gameAtom'
import WaitingRoomPlaylist from '../../components/WaitingRoomPlaylist/WaitingRoomPlaylist'

export default function WaitingRoom() {
    const game = useRecoilValue(gameState);
    const navigate = useNavigate();

    useEffect(() => {
        if (!game) {
            navigate('/');
        }

    }, [game])

    if (!game) {
        return null;
    }

    return (
        <div>
            <div>WaitingRoom</div>

            <div>CODE: {game.joinCode}</div>
            <div>Game mode: {game.gameMode}</div>
            <div>Max player: {game.maxPlayers}</div>
            <div>Max suggestions: {game.maxSuggestions}</div>
            <div>Max questions: {game.maxQuestions}</div>
            <WaitingRoomPlaylist />
        </div>
    )
}
