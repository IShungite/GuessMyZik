import React, { useCallback } from 'react'
import { useSetRecoilState } from 'recoil';
import { UpdateGameDto } from '../@Types/Game'
import { GamePlayer } from '../@Types/GamePlayer';
import { gameJoinCodeAtom, gameMaxPlayersAtom, gameMaxQuestionsAtom, gameMaxSuggestionsAtom, gameModeAtom, gamePlayersAtom, gamePlaylistIdAtom, gameStateAtom, gameTotalPlaylistTrackAtom } from '../atoms/gameAtom';

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

    }, [])

    const removeGamePlayer = useCallback((gamePlayerId: string) => {
        setGamePlayers((prevGamePlayers) => {
            return prevGamePlayers.filter((gp) => gp.id !== gamePlayerId);
        });
    }, [])

    const addGamePlayer = useCallback((gamePlayer: GamePlayer) => {
        setGamePlayers((prevGamePlayers) => {
            return [...prevGamePlayers, gamePlayer];
        });
    }, [])

    return { updateGame, removeGamePlayer, addGamePlayer }
}
