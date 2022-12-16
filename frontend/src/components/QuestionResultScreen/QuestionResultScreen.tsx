import { Button } from 'flowbite-react';
import React from 'react'
import { useRecoilValue } from 'recoil';
import { gameAnswersAtom, gameGoodAnswerAtom, gameSelectedAnswerAtom } from '../../atoms/gameAtom';
import gameService from '../../services/gameService';
import socketService from '../../services/socketService';
import GameAnswers from '../GameAnswers/GameAnswers';
import GamePlayingCurentQuestion from '../GamePlayingCurentQuestion/GamePlayingCurentQuestion';
import PlayersScore from '../PlayersScore/PlayersScore';

export default function QuestionResultScreen() {


    const handleClickNextQuestion = () => {
        if (socketService.socket) {
            gameService.nextSong(socketService.socket);
        }
    }

    return (
        <div className='flex flex-col gap-6 items-center'>
            <GamePlayingCurentQuestion />
            <GameAnswers />

            <PlayersScore />

            <Button onClick={handleClickNextQuestion}>
                Next question
            </Button>

        </div >
    )
}
