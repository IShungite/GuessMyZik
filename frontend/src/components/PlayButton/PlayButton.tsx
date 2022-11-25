import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import Game from '../../@Types/Game'
import { GamePlayer } from '../../@Types/GamePlayer'
import { authState } from '../../atoms/authAtom'
import { gameState, isInGameState } from '../../atoms/gameAtom'
import { backendApiUrl } from '../../constants'
import useFetch from '../../hooks/useFetch'
import gameService from '../../services/gameService'
import socketService from '../../services/socketService'

export default function PlayButton() {
    const { data, error, fetchData } = useFetch<Game>();

    const [isJoining, setIsJoining] = React.useState(false);

    const setGame = useSetRecoilState(gameState);
    const setIsInGame = useSetRecoilState(isInGameState)
    const navigate = useNavigate();

    const auth = useRecoilValue(authState);

    if (!auth) return null;

    const handleClickPlay = async () => {
        setIsJoining(true);
        const game = await fetchData(`${backendApiUrl}/games`, { method: 'POST' });
        if (game && socketService.socket) {
            try {
                const gameJoined = await gameService.joinGameRoom(socketService.socket, game.joinCode, auth.username);

                if (gameJoined) {
                    console.log('joined game room');
                    setIsInGame(true);
                    setGame(gameJoined);
                    navigate('/game');
                }

            } catch (e: any) {
                alert(e.error);
            } finally {
                setIsJoining(false);
            }
        }
    }

    return (
        <button type="button" className={`text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-xl px-5 py-2.5 text-center ${isJoining && 'disabled:bg-gray-500'}`} onClick={handleClickPlay} disabled={isJoining}>Play</button>
    )
}
