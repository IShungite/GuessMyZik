import { atom } from "recoil";
import Game from "../@Types/Game";

export const gameState = atom<Game>({
    key: 'game',
    default: undefined,
});

export const isInGameState = atom<boolean>({
    key: 'isInGame',
    default: false,
});