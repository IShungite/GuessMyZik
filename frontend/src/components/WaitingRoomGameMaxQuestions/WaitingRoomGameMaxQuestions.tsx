import React from 'react'
import { useRecoilValue } from 'recoil';
import { gameMaxQuestionsAtom } from '../../atoms/gameAtom';

export default function WaitingRoomGameMaxQuestions() {
    const maxQuestions = useRecoilValue(gameMaxQuestionsAtom);

    return (
        <div>Max Questions: {maxQuestions}</div>
    )
}
