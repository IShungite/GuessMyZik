import GameAnswer from "./GameAnswer";

export default interface GameQuestion {
    id: string;

    trackId: string;
    isDone: boolean;

    gameId: string;

    answers: GameAnswer[];
}