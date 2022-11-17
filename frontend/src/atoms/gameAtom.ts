import { atom } from "recoil";
import Game from "../@Types/Game";

export const gameState = atom<Game>({
    key: 'game',
    default: undefined,
});