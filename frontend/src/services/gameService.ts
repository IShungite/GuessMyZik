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

    public async onJoinGameRoom(socket: Socket, listener: (gamePlayer: GamePlayer) => void) {
        console.log("Add on_join_room listener");
        socket.on("on_join_room", ({ gamePlayer }: { gamePlayer: GamePlayer }) => listener(gamePlayer));
    }


    public async updateGame(socket: Socket, updateGameDto: UpdateGameDto) {
        socket.emit("update_game", { updateGameDto });
    }

    public async onGameUpdate(socket: Socket, listener: (updateGameDto: UpdateGameDto) => void) {
        socket.on("on_game_update", ({ updateGameDto }: { updateGameDto: UpdateGameDto }) => listener(updateGameDto));
    }

    public async leaveGameRoom(socket: Socket, userId: string) {
        socket.emit("leave_room", { userId });
        socket.removeAllListeners();
    }

    public async onLeaveGameRoom(socket: Socket, listener: (gamePlayerId: string) => void) {
        socket.on("on_leave_room", ({ gamePlayerId }: { gamePlayerId: string }) => listener(gamePlayerId));
    }
}

export default new GameService();