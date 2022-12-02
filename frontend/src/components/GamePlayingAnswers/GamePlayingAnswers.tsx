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
        <div>
            {gameAnswers.map((gameAnswer) => {
                const playerHasSelectedAnswer = !!(selectedAnswer)
                const isSelectedAnswer = gameAnswer.value === selectedAnswer;
                return (
                    <div key={gameAnswer.value}>
                        <Button disabled={playerHasSelectedAnswer} className={`${isSelectedAnswer && "bg-purple-500  disabled:hover:bg-purple-500"}`} onClick={() => handleClickAnswer(gameAnswer.value)}>
                            {gameAnswer.value}
                        </Button>
                    </div>
                )
            }

            )}
        </div>

    )
}
