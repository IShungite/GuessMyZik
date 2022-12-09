import { Button } from 'flowbite-react';
import React from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { gameAnswersAtom, gameSelectedAnswerAtom } from '../../atoms/gameAtom';
import gameService from '../../services/gameService';
import socketService from '../../services/socketService';

export default function GamePlayingAnswers() {
    const gameAnswers = useRecoilValue(gameAnswersAtom);
    const [selectedAnswer, setSelectedAnswer] = useRecoilState(gameSelectedAnswerAtom);

    const handleClickAnswer = (answer: string) => {
        if (socketService.socket) {
            gameService.sendAnswer(socketService.socket, answer);
            setSelectedAnswer(answer);
        }
    }

    return (
        <div className='flex justify-center'>
            <div className='grid grid-cols-2 gap-4 text-center max-w-md'>
                {gameAnswers.map((gameAnswer) => {
                    const playerHasSelectedAnswer = !!(selectedAnswer)
                    const isSelectedAnswer = gameAnswer.value === selectedAnswer;
                    return (
                        <div key={gameAnswer.value}>
                            <button type="button" onClick={() => handleClickAnswer(gameAnswer.value)} className={`text-white disabled:cursor-not-allowed font-medium rounded-lg text-sm px-5 py-2.5 text-center opacity-100 ${isSelectedAnswer ? "bg-purple-500 hover:bg-purple-700  disabled:hover:bg-purple-500" : "bg-blue-500 hover:bg-blue-700  disabled:hover:bg-blue-500"}`} disabled={playerHasSelectedAnswer}>{gameAnswer.value}
                            </button>
                        </div>
                    )
                }

                )}
            </div>
        </div>

    )
}
