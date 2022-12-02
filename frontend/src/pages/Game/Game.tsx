import React from 'react'
import { Navigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { GameState } from '../../@Types/Game';
import { gameGoodAnswerAtom, gameStateAtom } from '../../atoms/gameAtom';
import Playing from './Playing/Playing';
import Waiting from './Waiting/Waiting';
import { AudioPlayerProvider } from "react-use-audio-player"
import useInGameLogic from '../../hooks/useInGameLogic';
import Finished from './Finished/Finished';
import QuestionResultScreen from '../../components/QuestionResultScreen/QuestionResultScreen';


export default function Game() {
    useInGameLogic();

    const gameState = useRecoilValue(gameStateAtom);
    const goodAnswer = useRecoilValue(gameGoodAnswerAtom);

    if (!gameState) return <Navigate to="/" />

    switch (gameState) {
        case GameState.WAITING:
            return <Waiting />;
        case GameState.PLAYING:
            if (goodAnswer) {
                return <QuestionResultScreen />
            }
            return (
                <AudioPlayerProvider>
                    <Playing />
                </AudioPlayerProvider>
            );
        case GameState.FINISHED:
            return <Finished />;
        default:
            return <div>Loading..</div>
    }
}
