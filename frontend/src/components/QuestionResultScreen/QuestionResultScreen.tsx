import { Button } from 'flowbite-react';
import React from 'react'
import { useRecoilValue } from 'recoil';
import { gameAnswersAtom, gameGoodAnswerAtom, gamePlayersAtom, gameSelectedAnswerAtom } from '../../atoms/gameAtom';
import gameService from '../../services/gameService';
import socketService from '../../services/socketService';
import PlayersScore from '../PlayersScore/PlayersScore';

export default function QuestionResultScreen() {
    const goodAnswer = useRecoilValue(gameGoodAnswerAtom);
    const answers = useRecoilValue(gameAnswersAtom);
    const selectedAnswer = useRecoilValue(gameSelectedAnswerAtom);
    const gamePlayers = useRecoilValue(gamePlayersAtom);


    const handleClickNextQuestion = () => {
        if (socketService.socket) {
            gameService.nextSong(socketService.socket);
        }
    }

    return (
        <div>
            <div>
                <div>

                    {answers.map((answer) => {
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
                    }
                </div>

                <PlayersScore />

                <Button onClick={handleClickNextQuestion}>
                    Next question
                </Button>
            </div>

        </div >
    )
}
