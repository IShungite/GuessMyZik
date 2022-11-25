import { GamePlayer } from "./GamePlayer";
import GameQuestion from "./GameQuestion";

export default interface Game {
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
    gameQuestions?: GameQuestion[]; // when there is no gameQuestions, the api will not return it so we need to make it optional
}

export type UpdateGameDto = Partial<Game>;


export enum GameState {
    WAITING,
    PLAYING,
    FINISHED,
}

export enum GameMode {
    FIND_THE_ARTIST,
    FIND_THE_TRACK,
}