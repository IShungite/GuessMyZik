import GamePlayerAnswer from "./GamePlayerAnswer";

export interface GamePlayer {
    id: string;

    userId: string;
    gameId: string;

    isOwner: boolean;

    gamePlayerAnswers: GamePlayerAnswer[];
}