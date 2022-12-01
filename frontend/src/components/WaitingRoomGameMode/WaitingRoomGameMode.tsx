import React from 'react'
import { useRecoilValue } from 'recoil';
import { gameModeAtom } from '../../atoms/gameAtom';

export default function WaitingRoomGameMode() {
    const gameMode = useRecoilValue(gameModeAtom);

    return (
        <div>Game mode: {gameMode}</div>
    )
}
