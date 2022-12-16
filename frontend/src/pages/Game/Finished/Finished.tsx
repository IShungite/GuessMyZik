import React from 'react'
import GameAnswers from '../../../components/GameAnswers/GameAnswers'
import PlayersScore from '../../../components/PlayersScore/PlayersScore'

export default function Finished() {
    return (
        <div className='flex flex-col gap-6 items-center'>
            <div>
                Finished
            </div>
            <GameAnswers />
            <PlayersScore />
        </div>
    )
}
