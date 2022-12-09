import { Button } from 'flowbite-react';
import React from 'react'
import { useRecoilValue } from 'recoil';
import { gameAnswersAtom, gameGoodAnswerAtom, gameSelectedAnswerAtom } from '../../atoms/gameAtom';

export default function GameAnswers() {
    const goodAnswer = useRecoilValue(gameGoodAnswerAtom);
    const answers = useRecoilValue(gameAnswersAtom);
    const selectedAnswer = useRecoilValue(gameSelectedAnswerAtom);

    return (
        <div className='flex justify-center'>
            <div className='grid grid-cols-2 gap-4 text-center max-w-md'>
                {answers.map((answer) => {
                    const isGoodAnswer = answer.value === goodAnswer.value;

                    const isSelectedAnswer = answer.value === selectedAnswer;

                    let color = "bg-gray-200";
                    if (isGoodAnswer) {
                        if (isSelectedAnswer) {
                            color = "bg-green-800";
                        } else {
                            color = "bg-green-400";
                        }
                    } else {
                        if (isSelectedAnswer) {
                            color = "bg-red-800";
                        } else {
                            color = "bg-blue-400";
                        }
                    }

                    return (
                        <div key={answer.value}>
                            <button type="button" className={`text-white ${color} cursor-not-allowed font-medium rounded-lg text-sm px-5 py-2.5 text-center opacity-100`} disabled>{answer.value}
                            </button>

                        </div>
                    )
                })
                }
            </div>
        </div>
    )
}
