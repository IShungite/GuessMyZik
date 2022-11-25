import { Socket } from "socket.io-client";
import Game, { UpdateGameDto } from "../@Types/Game";
import { GamePlayer } from "../@Types/GamePlayer";

class GameService {

    public async joinGameRoom(socket: Socket, joinCode: string, username: string): Promise<Game> {
        return new Promise((resolve, reject) => {
            socket.emit("join_room", { joinCode, username });

            socket.on("join_success", ({ game }: { game: Game }) => resolve(game));

            socket.on("join_error", (error) => reject(error));
        });
    }

    public async onJoinGameRoom(socket: Socket, listener: (gamePlayer: GamePlayer) => void) {
        socket.on("on_join_room", ({ gamePlayer }: { gamePlayer: GamePlayer }) => listener(gamePlayer));
    }


    public async updateGame(socket: Socket, updateGameDto: UpdateGameDto) {
        socket.emit("update_game", { updateGameDto });
    }

    public async onGameUpdate(socket: Socket, listener: (updateGameDto: UpdateGameDto) => void) {
        socket.on("on_game_update", ({ updateGameDto }: { updateGameDto: UpdateGameDto }) => listener(updateGameDto));
    }

    public async leaveGameRoom(socket: Socket) {
        socket.emit("leave_room");
    }

    public async onLeaveGameRoom(socket: Socket, listener: (gamePlayerId: string) => void) {
        socket.on("on_leave_room", ({ gamePlayerId }: { gamePlayerId: string }) => listener(gamePlayerId));
    }
}

export default new GameService();