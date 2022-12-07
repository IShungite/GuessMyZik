import React from 'react'
import { useRecoilValue } from 'recoil'
import { gameCurrentQuestionAtom, gameMaxQuestionsAtom } from '../../atoms/gameAtom'

export default function GamePlayingCurentQuestion() {
    const currentQuestionNumber = useRecoilValue(gameCurrentQuestionAtom)
    const maxQuestions = useRecoilValue(gameMaxQuestionsAtom)
    return (
        <div>Question: {currentQuestionNumber}/{maxQuestions} </div>
    )
}
