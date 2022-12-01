import React from 'react'
import { useRecoilValue } from 'recoil';
import { gameMaxPlayersAtom } from '../../atoms/gameAtom';

export default function WaitingRoomGameMaxPlayers() {
    const maxPlayers = useRecoilValue(gameMaxPlayersAtom);

    return (
        <div>Max players: {maxPlayers}</div>
    )
}
