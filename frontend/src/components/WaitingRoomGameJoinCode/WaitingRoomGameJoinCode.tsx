import React from 'react'
import { useRecoilValue } from 'recoil'
import { gameJoinCodeAtom } from '../../atoms/gameAtom'

export default function WaitingRoomGameJoinCode() {
    const joinCode = useRecoilValue(gameJoinCodeAtom)

    return (
        <div className='text-center font-bold text-xl mb-5'>Join code: {joinCode}</div>
    )
}
