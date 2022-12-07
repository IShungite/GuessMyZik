import { Injectable, Logger } from '@nestjs/common';
import {
  Game, GameState, Prisma,
} from '@prisma/client';
import Track from '@Types/Deezer/Track';
import { DeezerService } from 'src/deezer/deezer.service';
import { PrismaService } from 'src/prisma.service';
import { SocketService } from 'src/socket.service';
import Timer from 'src/Timer/Timer';
import shuffle from 'src/utils/shuffle';

@Injectable()
export class GamesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly deezerService: DeezerService,
    private readonly socketService: SocketService,
  ) { }

  private logger: Logger = new Logger('GamesService');

  private timers: Map<string, Timer> = new Map();

  async create(): Promise<Game> {
    const joinCode = this.createJoinCode();
    const playlist = await this.deezerService.getRandomPlaylist();
    const maxQuestions = Math.ceil(playlist.nb_tracks / 2);

    const game = await this.prismaService.game.create({
      data: {
        joinCode, playlistId: playlist.id, maxQuestions, totalPlaylistTrack: playlist.nb_tracks,
      },
    });

    return game;
  }

  createJoinCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
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

  async startGame(gameRoom: string) {
    const game = await this.prismaService.game.findFirst({ where: { joinCode: gameRoom } });

    if (!game) {
      throw new Error("Game doesn't exist");
    }

    const tracks = await this.deezerService.getRandomPlaylistTracks(game.playlistId, game.maxQuestions);

    const createGameQuestionsPromises = tracks.map((track, index) => this.prismaService.gameQuestion.create({
      data: {
        trackId: track.id,
        gameId: game.id,
        number: index,
      },
    }));

    await Promise.all(createGameQuestionsPromises);

    const gameUpdated = await this.prismaService.game.update({
      where: { id: game.id },
      data: { state: GameState.PLAYING },
    });

    return gameUpdated;
  }

  async nextSong(gameRoom: string): Promise<{ gameAnswers: { value: string }[], track: Track, game: Game }> {
    const game = await this.prismaService.game.findFirstOrThrow(
      { where: { joinCode: gameRoom, state: GameState.PLAYING } },
    );

    const nextGameQuestionNumber = game.currentQuestionNumber + 1;

    const gameQuestion = await this.prismaService.gameQuestion.findFirstOrThrow({
      where: { gameId: game.id, number: nextGameQuestionNumber },
    });

    const track = await this.deezerService.getTrack(gameQuestion.trackId);

    const similarArtists = await this.deezerService.getRandomSimilarArtists(track.artist.id, game.maxSuggestions - 1);

    const suggestions = [track.artist.name, ...similarArtists.map((artist) => artist.name)];

    const suggestionsShuffled = shuffle(suggestions);

    const createGameAnswerPromises = suggestionsShuffled.map((suggestion) => this.prismaService.gameAnswer.create({
      data: {
        questionId: gameQuestion.id,
        value: suggestion,
        isRight: suggestion === track.artist.name,
      },
      select: { value: true },
    }));

    const gameAnswers = await Promise.all(createGameAnswerPromises);

    await this.prismaService.game.update({
      where: { id: game.id },
      data: { currentQuestionNumber: nextGameQuestionNumber }
      ,
    });

    this.logger.log(`The next song from game ${gameRoom} gameQuestion ${gameQuestion.id} is ${track.title}`);

    return {
      gameAnswers,
      track,
      game,
    };
  }

  calcAnswerScore(timeElapsed: number, duration: number) {
    const maxPoint = 500;
    const percent = (timeElapsed * 100) / duration;

    return Math.floor((percent * maxPoint) / 100);
  }

  async sendAnswer(gameId: string, socketId: string, answer: string) {
    const timer = this.timers.get(gameId);

    this.logger.log(`The player ${socketId} is sending answer ${answer} for game ${gameId} in ${timer.timeElapsed}s`);

    const game = await this.prismaService.game.findFirstOrThrow(
      { where: { id: gameId, state: GameState.PLAYING } },
    );

    const gamePlayer = await this.prismaService.gamePlayer.findFirstOrThrow({ where: { gameId: game.id, socketId } });

    const gameQuestion = await this.prismaService.gameQuestion.findFirstOrThrow({
      where: { gameId: game.id, number: game.currentQuestionNumber, isDone: false },
    });

    const gameAnswer = await this.prismaService.gameAnswer.findFirstOrThrow({
      where: { questionId: gameQuestion.id, value: answer },
    });

    const answerAlreadySent = await this.prismaService.gamePlayerAnswer.findFirst({
      where: { gameAnswerId: gameAnswer.id, gamePlayerId: gamePlayer.id },
    });

    if (answerAlreadySent) {
      throw new Error('Answer already sent');
    }

    const goodAnswer = await this.prismaService.gameAnswer.findFirstOrThrow({
      where: { questionId: gameQuestion.id, isRight: true },
    });

    const isGoodAnswer = gameAnswer.id === goodAnswer.id;

    const score = this.calcAnswerScore(timer.timeElapsed, timer.duration);

    this.logger.log(`gamePlayer ${gamePlayer.id} won ${score} points`);

    await Promise.all([
      isGoodAnswer && this.prismaService.gamePlayer.update({
        where: { id: gamePlayer.id },
        data: { score: gamePlayer.score += score },
      }),

      this.prismaService.gamePlayerAnswer.create({
        data: {
          gamePlayerId: gamePlayer.id,
          gameAnswerId: gameAnswer.id,
        },
      }),
    ]);

    this.logger.log(`The player ${socketId} has sent answer ${answer} for game ${gameId}`);
  }

  async allPlayersAnswered(gameId: string) {
    this.logger.log(`Checking if all players answered for game ${gameId}`);

    const game = await this.prismaService.game.findUniqueOrThrow({ where: { id: gameId } });

    const gameQuestion = await this.prismaService.gameQuestion.findFirstOrThrow({
      where: { gameId: game.id, number: game.currentQuestionNumber, isDone: false },
    });

    const gamePlayers = await this.prismaService.gamePlayer.findMany({ where: { gameId: game.id } });

    const gamePlayersAnswers = await this.prismaService.gamePlayerAnswer.findMany({
      where: { gameAnswer: { questionId: gameQuestion.id } },
    });

    const allPlayersAnswered = gamePlayers.length === gamePlayersAnswers.length;

    this.logger.log(`All players answered for game ${gameId} : ${allPlayersAnswered}`);

    return allPlayersAnswered;
  }

  async getGoodAnswer(gameId: string) {
    const game = await this.prismaService.game.findUniqueOrThrow({ where: { id: gameId } });

    const gameQuestion = await this.prismaService.gameQuestion.findFirstOrThrow({
      where: { gameId: game.id, number: game.currentQuestionNumber },
    });

    const gameAnswer = await this.prismaService.gameAnswer.findFirstOrThrow({
      where: { questionId: gameQuestion.id, isRight: true },
      select: { value: true },
    });

    this.logger.log(`Good answer for game ${gameId} is ${gameAnswer.value}`);

    return gameAnswer;
  }

  async UpdateGameState(gameId: string, options?: { forceRoundEnd: boolean }) {
    this.logger.log(`Checking update game state for game ${gameId}`);

    const game = await this.prismaService.game.findFirstOrThrow({ where: { id: gameId, state: GameState.PLAYING } });

    const isRoundEnded = options?.forceRoundEnd || await this.isRoundEnded(game.id);

    if (!isRoundEnded) return;

    await this.setGameQuestionDone(gameId, game.currentQuestionNumber);

    this.stopTimer(gameId);

    const isGameEnded = await this.isGameEnded(gameId);

    if (isGameEnded) {
      this.gameEnd(gameId, game.joinCode);
      return;
    }

    await this.roundEnd(gameId, game.joinCode);
  }

  async gameEnd(gameId: string, joinCode: string) {
    const goodAnswer = await this.getGoodAnswer(gameId);

    const updateGameDto: Prisma.GameUpdateInput = {
      state: GameState.FINISHED,
    };

    await this.prismaService.game.update({
      where: { id: gameId },
      data: updateGameDto,
    });

    this.socketService.socket.to(joinCode).emit('on_game_end', { updateGameDto, goodAnswer });
  }

  async roundEnd(gameId: string, joinCode: string) {
    const goodAnswer = await this.getGoodAnswer(gameId);
    const scoresWithGamePlayerId = await this.prismaService.gamePlayer.findMany({
      where: { gameId },
      select: { score: true, id: true },
    });

    await this.prismaService.game.update({
      where: { id: gameId },
      data: {
        currentQuestionNumber: { increment: 1 },
      },
    });

    this.socketService.socket.to(joinCode).emit('on_show_round_result', { goodAnswer, scoresWithGamePlayerId });
  }

  async isRoundEnded(gameId: string) {
    this.logger.log(`Checking if round is ended for game ${gameId}`);

    const allPlayersAnswered = await this.allPlayersAnswered(gameId);

    return allPlayersAnswered;
  }

  async isGameEnded(gameId: string) {
    this.logger.log(`Checking if game is ended for game ${gameId}`);

    const game = await this.prismaService.game.findUniqueOrThrow({ where: { id: gameId } });

    const gameQuestions = await this.prismaService.gameQuestion.findMany({ where: { gameId: game.id } });

    const gameQuestionsDone = gameQuestions.filter((gameQuestion) => gameQuestion.isDone);

    const gameIsEnded = gameQuestionsDone.length === gameQuestions.length;

    this.logger.log(`Game is ended for game ${gameId} : ${gameIsEnded}`);

    return gameIsEnded;
  }

  async setGameQuestionDone(gameId: string, questionNumber: number) {
    const gameQuestion = await this.prismaService.gameQuestion.findFirstOrThrow({
      where: { gameId, number: questionNumber, isDone: false },
    });

    this.logger.log(`Setting game question ${gameQuestion.id} as done for game ${gameId}`);

    await this.prismaService.gameQuestion.update({
      where: { id: gameQuestion.id },
      data: { isDone: true },
    });
  }

  startTimer(gameRoom: string, gameId: string) {
    this.logger.log(`Starting timer for game ${gameId}`);

    const timer = new Timer({
      duration: 15,
      onTimerUpdate: (timeRemaining: number) => {
        this.socketService.socket.to(gameRoom).emit('on_timer_update', { timeRemaining });
      },
      onTimerEnd: () => {
        this.UpdateGameState(gameId, { forceRoundEnd: true });
      },
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

  async update(id: string, updateGameDto: Prisma.GameUpdateInput) {
    return this.prismaService.game.update({
      where: { id },
      data: updateGameDto,
    });
  }

  async remove(id: string) {
    return this.prismaService.game.delete({ where: { id } });
  }

  async removeAll() {
    const { count } = await this.prismaService.game.deleteMany();
    return count;
  }
}
