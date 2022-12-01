import React from 'react'
import { Navigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { GameState } from '../../@Types/Game';
import { gameStateAtom } from '../../atoms/gameAtom';
import Playing from './Playing/Playing';
import Waiting from './Waiting/Waiting';
import { AudioPlayerProvider } from "react-use-audio-player"
import useGameLogic from '../../hooks/useInGameLogic';


export default function Game() {
    useGameLogic();

    const gameState = useRecoilValue(gameStateAtom);

    if (!gameState) return <Navigate to="/" />

    switch (gameState) {
        case GameState.WAITING:
            return <Waiting />;
        case GameState.PLAYING:
            return (
                <AudioPlayerProvider>
                    <Playing />
                </AudioPlayerProvider>
            );
        default:
            return <div>Loading..</div>
    }
}
