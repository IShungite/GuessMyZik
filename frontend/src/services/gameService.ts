import { Socket } from "socket.io-client";
import Game, { UpdateGameDto } from "../@Types/Game";
import { GamePlayer } from "../@Types/GamePlayer";

class GameService {

    public async joinGameRoom(socket: Socket, joinCode: string, userId: string): Promise<Game> {
        return new Promise((resolve, reject) => {
            socket.emit("join_room", { joinCode, userId });

            socket.on("join_success", ({ game }: { game: Game }) => resolve(game));

            socket.on("join_error", (error) => reject(error));
        });
    }

    public onJoinGameRoom(socket: Socket, listener: (gamePlayer: GamePlayer) => void) {
        socket.on("on_join_room", ({ gamePlayer }: { gamePlayer: GamePlayer }) => listener(gamePlayer));
    }

    public updateGame(socket: Socket, updateGameDto: UpdateGameDto) {
        socket.emit("update_game", { updateGameDto });
    }

    public startGame(socket: Socket) {
        socket.emit("start_game");
    }

    public onStartGame(socket: Socket, listener: (game: Game) => void) {
        socket.on("on_game_start", ({ game }: { game: Game }) => {
            console.log("on_game_start");
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

    public nextSong(socket: Socket) {
        socket.emit("next_song");
    }

    public sendAnswer(socket: Socket, answer: string) {
        socket.emit("send_answer", { answer });
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