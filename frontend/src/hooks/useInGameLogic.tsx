import React, { useCallback, useEffect } from 'react'
import { Navigate } from 'react-router-dom';
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import Game from '../@Types/Game';
import { GamePlayer } from '../@Types/GamePlayer';
import { authState } from '../atoms/authAtom';
import { gameAnswersAtom, gameGoodAnswerAtom, gameSelectedAnswerAtom, gameTrackPreviewAtom } from '../atoms/gameAtom';
import gameService from '../services/gameService';
import socketService from '../services/socketService';
import useUpdateGame from './useUpdateGame';

export default function useInGameLogic() {
    const auth = useRecoilValue(authState);
    const { updateGame, removeGamePlayer, addGamePlayer } = useUpdateGame();
    const setGameTrackPreview = useSetRecoilState(gameTrackPreviewAtom);
    const setGameAnswers = useSetRecoilState(gameAnswersAtom);
    const resetGoodAnswer = useResetRecoilState(gameGoodAnswerAtom)
    const resetSelectedAnswer = useResetRecoilState(gameSelectedAnswerAtom)
    const setGameGoodAnswer = useSetRecoilState(gameGoodAnswerAtom);

    const handleGameUpdate = useCallback(() => {
        if (socketService.socket) {
            gameService.onGameUpdate(socketService.socket, (updateGameDto) => {
                updateGame(updateGameDto);
            });
        }
    }, [updateGame]);

    const handleLeaveGameRoom = useCallback(() => {
        if (socketService.socket) {
            gameService.onLeaveGameRoom(socketService.socket, (gamePlayerId: string) => {
                removeGamePlayer(gamePlayerId);
            });
        }
    }, [removeGamePlayer]);

    const handleGameStart = useCallback(() => {
        if (socketService.socket) {
            gameService.onStartGame(socketService.socket, (game) => {
                updateGame(game);
            });
        }
    }, [updateGame]);

    const handleJoinGameRoom = useCallback(() => {
        if (socketService.socket) {
            gameService.onJoinGameRoom(socketService.socket, (gamePlayer: GamePlayer) => {
                addGamePlayer(gamePlayer);
            });
        }
    }, [addGamePlayer]);

    const handleNextSong = useCallback(() => {
        if (socketService.socket) {
            gameService.onNextSong(socketService.socket, (trackPreview, gameAnswers) => {
                resetGoodAnswer();
                resetSelectedAnswer();
                setGameAnswers(gameAnswers);
                setGameTrackPreview(trackPreview);
            });
        }
    }, [])

    const handleShowRoundResult = useCallback(() => {
        if (socketService.socket) {
            gameService.onShowRoundResult(socketService.socket, (goodAnswer) => {
                setGameGoodAnswer(goodAnswer);
            });
        }
    }, [])


    const handleGameEnd = useCallback(() => {
        if (socketService.socket) {
            gameService.onGameEnd(socketService.socket, (updateGameDto, goodAnswer) => {
                updateGame(updateGameDto);
                setGameGoodAnswer(goodAnswer);
            });
        }

    }, [updateGame])

    useEffect(() => {
        if (!auth) return;

        handleGameUpdate();
        handleLeaveGameRoom();
        handleGameStart();
        handleJoinGameRoom();
        handleNextSong();
        handleShowRoundResult();
        handleGameEnd();

        return () => {
            if (socketService.socket) {
                gameService.leaveGameRoom(socketService.socket, auth.id);
            }
        }
    }, []);

    if (!auth) return <Navigate to="/" />

    return null;
}
