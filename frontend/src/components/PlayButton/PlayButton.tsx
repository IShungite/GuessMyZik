import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'
import Game from '../../@Types/Game'
import { GamePlayer } from '../../@Types/GamePlayer'
import { gameState } from '../../atoms/gameAtom'
import useFetch from '../../hooks/useFetch'

export default function PlayButton() {
    const { data, isLoading, error, fetchData } = useFetch<{ game: Game, gamePlayer: GamePlayer }>(`http://localhost:3000/games`, { method: 'POST' });
    const setGame = useSetRecoilState(gameState);
    const navigate = useNavigate();

    const handleClickPlay = async () => {
        await fetchData();
    }

    React.useEffect(() => {
        if (data) {
            setGame(data.game);
            navigate(`/waiting-room`);
        }
    }, [data])

    return (
        <button className={`bg-orange-200 hover:bg-orange-300 pt-2 pb-2 pl-5 pr-5 ${isLoading && 'disabled:bg-gray-500'}`} disabled={isLoading} onClick={handleClickPlay}>Play</button>
    )
}
