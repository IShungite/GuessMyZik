import { Injectable, Logger } from '@nestjs/common';
import {
  Game, Prisma,
} from '@prisma/client';
import { GameAnswersService } from 'src/game-answers/game-answers.service';
import { GamePlayerAnswersService } from 'src/game-player-answers/game-player-answers.service';
import { GamePlayersService } from 'src/game-players/game-players.service';
import { GameQuestionsService } from 'src/game-questions/game-questions.service';
import { GameEngine } from 'src/gameEngine/GameEngine';
import { PrismaService } from 'src/prisma.service';
import { SocketService } from 'src/socket.service';
import Timer from 'src/Timer/Timer';

@Injectable()
export class GamesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly socketService: SocketService,
    private readonly gamePlayersService: GamePlayersService,
    private readonly gameQuestionsService: GameQuestionsService,
    private readonly gameAnswersService: GameAnswersService,
    private readonly gamePlayerAnswersService: GamePlayerAnswersService,
  ) { }

  private logger: Logger = new Logger('GamesService');

  private timers: Map<string, Timer> = new Map();

  async create(): Promise<Game> {
    const { joinCode, playlist, maxQuestions } = await GameEngine.GetDataToCreateGame();

    const game = await this.prismaService.game.create({
      data: {
        joinCode, playlistId: playlist.id, maxQuestions, totalPlaylistTrack: playlist.nb_tracks,
      },
    });

    return game;
  }

  async getGameEngine(joinCode: string) {
    const game = await this.findByJoinCode(joinCode);

    return new GameEngine({
      game,
      gamesService: this,
      gamePlayersService: this.gamePlayersService,
      gameQuestionsService: this.gameQuestionsService,
      socketService: this.socketService,
      gameAnswersService: this.gameAnswersService,
      gamePlayerAnswersService: this.gamePlayerAnswersService,
    });
  }

  async quitGame(joinCode: string, userId: string) {
    const game = await this.prismaService.game.findFirst({ where: { joinCode } });

    if (!game) {
      throw new Error("Game doesn't exist");
    }

    const gamePlayer = await this.prismaService.gamePlayer.findFirst(
      { where: { gameId: game.id, userId } },
    );

    if (!gamePlayer) {
      throw new Error("GamePlayer doesn't exist");
    }

    return this.prismaService.gamePlayer.update(
      { where: { id: gamePlayer.id }, data: { isConnected: false } },
    );
  }

  getTimer(gameId: string) {
    return this.timers.get(gameId);
  }

  startTimer(gameRoom: string, gameId: string, onTimerEnd: () => void) {
    this.logger.log(`Starting timer for game ${gameId}`);

    const timer = new Timer({
      duration: 15,
      onTimerUpdate: (timeRemaining: number) => {
        this.socketService.socket.to(gameRoom).emit('on_timer_update', { timeRemaining });
      },
      onTimerEnd,
    });

    timer.start();

    this.timers.set(gameId, timer);
  }

  stopTimer(gameId: string) {
    this.logger.log(`Stopping timer for game ${gameId}`);
    const timer = this.timers.get(gameId);

    if (timer) {
      timer.stop();
      this.timers.delete(gameId);
    }
  }

  async findByJoinCode(joinCode: string) {
    return this.prismaService.game.findFirstOrThrow({ where: { joinCode } });
  }

  async update(updateArgs: Prisma.GameUpdateArgs) {
    return this.prismaService.game.update(updateArgs);
  }

  async findAll() {
    return this.prismaService.game.findMany();
  }

  async findOne(where: Prisma.GameWhereUniqueInput) {
    return this.prismaService.game.findUnique({ where });
  }

  async findGamePlayers(where: Prisma.GamePlayerWhereInput) {
    return this.prismaService.gamePlayer.findMany({
      where,
    });
  }

  async findFirst(where: Prisma.GameWhereInput) {
    return this.prismaService.game.findFirstOrThrow({ where });
  }

  async remove(id: string) {
    return this.prismaService.game.delete({ where: { id } });
  }

  async removeAll() {
    const { count } = await this.prismaService.game.deleteMany();
    return count;
  }
}
