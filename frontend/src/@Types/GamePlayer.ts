import GamePlayerAnswer from "./GamePlayerAnswer";

export default interface GamePlayer {
    id: string;

    userId: string;
    gameId: string;

    isOwner: boolean;

    gamePlayerAnswers: GamePlayerAnswer[];
}

export interface GamePlayerFormat {
    id: string,
    username: string
}