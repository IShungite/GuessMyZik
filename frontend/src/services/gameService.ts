import { Socket } from "socket.io-client";
import Game, { UpdateGameDto } from "../@Types/Game";
import { GamePlayerFormat } from "../@Types/GamePlayer";

class GameService {

    public async joinGameRoom(socket: Socket, joinCode: string, userId: string): Promise<UpdateGameDto> {
        return new Promise((resolve, reject) => {
            socket.emit("join_room", { joinCode, userId });

            socket.on("join_success", ({ game }: { game: UpdateGameDto }) => resolve(game));

            socket.on("join_error", (error) => reject(error));
        });
    }

    public onJoinGameRoom(socket: Socket, listener: (gamePlayer: GamePlayerFormat) => void) {
        socket.on("on_join_room", ({ gamePlayer }: { gamePlayer: GamePlayerFormat }) => listener(gamePlayer));
    }

    public updateGame(socket: Socket, updateGameDto: UpdateGameDto) {
        socket.emit("update_game", { updateGameDto });
    }

    public startGame(socket: Socket) {
        socket.emit("start_game");
    }

    public onStartGame(socket: Socket, listener: (game: UpdateGameDto) => void) {
        socket.on("on_game_start", ({ game }: { game: UpdateGameDto }) => {
            listener(game)
        }
        );
    }

    public onGameUpdate(socket: Socket, listener: (updateGameDto: UpdateGameDto) => void) {
        socket.on("on_game_update", ({ updateGameDto }: { updateGameDto: UpdateGameDto }) => listener(updateGameDto));
    }

    public onNextSong(socket: Socket, listener: (trackPreview: string, gameAnswers: { value: string }[]) => void) {
        socket.on("on_next_song", ({ trackPreview, gameAnswers }: { trackPreview: string, gameAnswers: { value: string }[] }) => listener(trackPreview, gameAnswers));
    }

    public onShowRoundResult(socket: Socket, listener: (goodAnswer: { value: string }, scoresWithGamePlayerId: { id: string, score: number }[]) => void) {
        socket.on("on_show_round_result", ({ goodAnswer, scoresWithGamePlayerId }: { goodAnswer: { value: string }, scoresWithGamePlayerId: { id: string, score: number }[] }) => listener(goodAnswer, scoresWithGamePlayerId));
    }

    public onGameEnd(socket: Socket, listener: (updateGameDto: UpdateGameDto, goodAnswer: { value: string }) => void) {
        socket.on("on_game_end", ({ updateGameDto, goodAnswer }: { updateGameDto: UpdateGameDto, goodAnswer: { value: string } }) => listener(updateGameDto, goodAnswer));
    }

    public nextSong(socket: Socket) {
        socket.emit("next_song");
    }

    public sendAnswer(socket: Socket, answer: string) {
        socket.emit("send_answer", { answer });
    }

    public onTimerUpdate(socket: Socket, listener: (timeRemaining: number) => void) {
        socket.on("on_timer_update", ({ timeRemaining }: { timeRemaining: number }) => listener(timeRemaining));
    }

    public leaveGameRoom(socket: Socket, userId: string) {
        socket.emit("leave_room", { userId });
        socket.removeAllListeners();
    }

    public onLeaveGameRoom(socket: Socket, listener: (gamePlayerId: string) => void) {
        socket.on("on_leave_room", ({ gamePlayerId }: { gamePlayerId: string }) => listener(gamePlayerId));
    }
}

export default new GameService();