import React from 'react'
import { useRecoilValue } from 'recoil';
import { gameAnswersAtom, gameGoodAnswerAtom, gameSelectedAnswerAtom } from '../../atoms/gameAtom';

export default function GameAnswers() {
    const goodAnswer = useRecoilValue(gameGoodAnswerAtom);
    const answers = useRecoilValue(gameAnswersAtom);
    const selectedAnswer = useRecoilValue(gameSelectedAnswerAtom);

    return (
        <div>{answers.map((answer) => {
            const isGoodAnswer = answer.value === goodAnswer.value;

            const isSelectedAnswer = answer.value === selectedAnswer;

            let color = "bg-gray-200";
            if (isGoodAnswer) {
                if (isSelectedAnswer) {
                    color = "bg-green-500";
                } else {
                    color = "bg-green-200";
                }
            } else {
                if (isSelectedAnswer) {
                    color = "bg-red-200";
                } else {
                    color = "bg-blue-200";
                }
            }

            return (
                <div key={answer.value} className={`${color}`}>
                    {answer.value}
                </div>
            )
        })
        }</div>
    )
}
