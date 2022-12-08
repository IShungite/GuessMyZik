import React, { useCallback } from 'react'
import { useSetRecoilState } from 'recoil';
import { UpdateGameDto } from '../@Types/Game'
import { GamePlayerFormat } from '../@Types/GamePlayer';
import { gameCurrentQuestionAtom, gameJoinCodeAtom, gameMaxPlayersAtom, gameMaxQuestionsAtom, gameMaxSuggestionsAtom, gameModeAtom, gamePlayersAtom, gamePlaylistIdAtom, gameStateAtom, gameTotalPlaylistTrackAtom } from '../atoms/gameAtom';

export default function useUpdateGame() {
    const setGameState = useSetRecoilState(gameStateAtom);
    const setGameModeAtom = useSetRecoilState(gameModeAtom);
    const setGameJoinCode = useSetRecoilState(gameJoinCodeAtom);
    const setGamePlaylistId = useSetRecoilState(gamePlaylistIdAtom);
    const setGameMaxQuestions = useSetRecoilState(gameMaxQuestionsAtom);
    const setGameMaxSuggestions = useSetRecoilState(gameMaxSuggestionsAtom);
    const setGameMaxPlayers = useSetRecoilState(gameMaxPlayersAtom);
    const setGamePlayers = useSetRecoilState(gamePlayersAtom);
    const setGameTotalPlaylistTracks = useSetRecoilState(gameTotalPlaylistTrackAtom)
    const setGameCurrentQuestionNumber = useSetRecoilState(gameCurrentQuestionAtom)

    const updateGame = useCallback((updateGameDto: UpdateGameDto) => {
        if (updateGameDto.state) {
            setGameState(updateGameDto.state);
        }

        if (updateGameDto.gameMode) {
            setGameModeAtom(updateGameDto.gameMode);
        }

        if (updateGameDto.joinCode) {
            setGameJoinCode(updateGameDto.joinCode);
        }

        if (updateGameDto.playlistId) {
            setGamePlaylistId(updateGameDto.playlistId);
        }

        if (updateGameDto.maxQuestions) {
            setGameMaxQuestions(updateGameDto.maxQuestions);
        }

        if (updateGameDto.maxSuggestions) {
            setGameMaxSuggestions(updateGameDto.maxSuggestions);
        }

        if (updateGameDto.maxPlayers) {
            setGameMaxPlayers(updateGameDto.maxPlayers);
        }

        if (updateGameDto.gamePlayers) {
            setGamePlayers(updateGameDto.gamePlayers);
        }

        if (updateGameDto.totalPlaylistTrack) {
            setGameTotalPlaylistTracks(updateGameDto.totalPlaylistTrack);
        }

        if (updateGameDto.currentQuestionNumber) {
            setGameCurrentQuestionNumber(updateGameDto.currentQuestionNumber);
        }

    }, [])

    const removeGamePlayer = useCallback((gamePlayerId: string) => {
        setGamePlayers((prevGamePlayers) => {
            return prevGamePlayers.filter((gp) => gp.id !== gamePlayerId);
        });
    }, [])

    const addGamePlayer = useCallback((gamePlayer: GamePlayerFormat) => {
        setGamePlayers((prevGamePlayers) => {
            return [...prevGamePlayers, gamePlayer];
        });
    }, [])

    const updateGamePlayers = (gamePlayers: Partial<GamePlayerFormat> & { id: string }[]) => {
        setGamePlayers((prevGamePlayers) => prevGamePlayers.map((gamePlayer) => {
            const newGamePlayerData = gamePlayers.find((gp) => gp.id)

            if (!newGamePlayerData) return gamePlayer;

            const { id, ...rest } = newGamePlayerData

            return {
                ...gamePlayer, ...rest
            }
        }))
    }

    const increaseCurrentQuestionNumber = () => {
        setGameCurrentQuestionNumber((prevValue) => prevValue += 1)
    }

    return { updateGame, removeGamePlayer, addGamePlayer, updateGamePlayers, increaseCurrentQuestionNumber }
}
