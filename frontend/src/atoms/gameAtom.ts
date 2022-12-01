import { atom } from "recoil";
import Game, { GameMode, GameState } from "../@Types/Game";
import { GamePlayer } from "../@Types/GamePlayer";

// export const gameState = atom<Game>({
//     key: 'game',
//     default: undefined,
// });

export const gameStateAtom = atom<GameState>({
    key: 'gameState',
    default: undefined,
});

export const gameModeAtom = atom<GameMode>({
    key: 'gameMode',
    default: undefined,
});

export const gameJoinCodeAtom = atom<string>({
    key: 'gameJoinCode',
    default: undefined,
})

export const gamePlaylistIdAtom = atom<number>({
    key: 'gamePlaylistId',
    default: undefined,
})

export const gameMaxQuestionsAtom = atom<number>({
    key: 'gameMaxQuestions',
    default: undefined,
})

export const gameMaxSuggestionsAtom = atom<number>({
    key: 'gameMaxSuggestions',
    default: undefined,
})

export const gameMaxPlayersAtom = atom<number>({
    key: 'gameMaxPlayers',
    default: undefined,
})

export const gamePlayersAtom = atom<GamePlayer[]>({
    key: 'gamePlayers',
    default: [],
});

export const isOwnerAtom = atom<boolean>({
    key: 'isOwner',
    default: false,
});
