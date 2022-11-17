import { GamePlayer } from "./GamePlayer";
import GameQuestion from "./GameQuestion";

export default interface {
    id: string;

    state: GameState;
    gameMode: GameMode;
    joinCode: string;
    playlistId: number;
    totalPlaylistTrack: number;
    maxQuestions: number;
    maxSuggestions: number;
    maxPlayers: number;

    gamePlayers: GamePlayer[];
    gameQuestions: GameQuestion[];
}


enum GameState {
    WAITING,
    PLAYING,
    FINISHED,
}

enum GameMode {
    FIND_THE_ARTIST,
    FIND_THE_TRACK,
}