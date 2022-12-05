import React from 'react'
import { useRecoilValue } from 'recoil'
import { gameTimeRemainingAtom } from '../../atoms/gameAtom'

export default function GamePlayingTimer() {
    const timeRemaining = useRecoilValue(gameTimeRemainingAtom);
    return (
        <div>Time remaning: {timeRemaining}</div>
    )
}
