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

    const [osJoining, setIsJoining] = React.useState(false);

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
        <button className={`bg-orange-200 hover:bg-orange-300 pt-2 pb-2 pl-5 pr-5 ${osJoining && 'disabled:bg-gray-500'}`} disabled={osJoining} onClick={handleClickPlay}>Play</button>
    )
}
