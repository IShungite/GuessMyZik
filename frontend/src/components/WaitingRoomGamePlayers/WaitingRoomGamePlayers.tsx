import React from 'react'
import { useRecoilValue } from 'recoil';
import { GamePlayer } from '../../@Types/GamePlayer';
import { gamePlayersAtom } from '../../atoms/gameAtom';

export default function WaitingRoomGamePlayers() {
    const gamePlayers = useRecoilValue(gamePlayersAtom);

    return (
        <div>
            <div className='underline mb-2'>Players:</div>
            <div className='ml-5'>
                {gamePlayers && gamePlayers.map((gamePlayer: GamePlayer) => {
                    return <div key={gamePlayer.userId}>{gamePlayer.userId}</div>
                })}
            </div>
        </div>
    )
}
