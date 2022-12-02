import { Injectable, Logger } from '@nestjs/common';
import {
  Game, GameState, Prisma,
} from '@prisma/client';
import Track from '@Types/Deezer/Track';
import { DeezerService } from 'src/deezer/deezer.service';
import { PrismaService } from 'src/prisma.service';
import { SocketService } from 'src/socket.service';
import shuffle from 'src/utils/shuffle';

@Injectable()
export class GamesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly deezerService: DeezerService,
    private readonly socketService: SocketService,
  ) { }

  private logger: Logger = new Logger('GamesService');

  async create(): Promise<Game> {
    const joinCode = this.createJoinCode();
    const playlist = await this.deezerService.getRandomPlaylist();
    const maxQuestions = Math.ceil(playlist.nb_tracks / 2);

    const game = await this.prismaService.game.create({
      data: { joinCode, playlistId: playlist.id, maxQuestions },
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

    const createGameQuestionsPromises = tracks.map((track) => this.prismaService.gameQuestion.create({
      data: {
        trackId: track.id,
        gameId: game.id,
      },
    }));

    await Promise.all(createGameQuestionsPromises);

    const gameUpdated = await this.prismaService.game.update({
      where: { id: game.id },
      data: { state: GameState.PLAYING },
    });

    return gameUpdated;
  }

  async nextSong(gameRoom: string): Promise<{ gameAnswers: { value: string }[], track: Track }> {
    const game = await this.prismaService.game.findFirstOrThrow(
      { where: { joinCode: gameRoom, state: GameState.PLAYING } },
    );

    const gameQuestion = await this.prismaService.gameQuestion.findFirstOrThrow({
      where: { gameId: game.id, isDone: false },
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

    this.logger.log(`The next song from game ${gameRoom} gameQuestion ${gameQuestion.id} is ${track.title}`);

    return {
      gameAnswers,
      track,
    };
  }

  async sendAnswer(gameId: string, socketId: string, answer: string) {
    this.logger.log(`The player ${socketId} is sending answer ${answer} for game ${gameId}`);

    const game = await this.prismaService.game.findFirstOrThrow(
      { where: { id: gameId, state: GameState.PLAYING } },
    );

    const gamePlayer = await this.prismaService.gamePlayer.findFirstOrThrow({ where: { gameId: game.id, socketId } });

    const gameQuestion = await this.prismaService.gameQuestion.findFirstOrThrow({
      where: { gameId: game.id, isDone: false },
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

    await this.prismaService.gamePlayerAnswer.create({
      data: {
        gamePlayerId: gamePlayer.id,
        gameAnswerId: gameAnswer.id,
      },
    });

    this.logger.log(`The player ${socketId} has sent answer ${answer} for game ${gameId}`);
  }

  async allPlayersAnswered(gameId: string) {
    this.logger.log(`Checking if all players answered for game ${gameId}`);

    const game = await this.prismaService.game.findUniqueOrThrow({ where: { id: gameId } });

    const gameQuestion = await this.prismaService.gameQuestion.findFirstOrThrow({
      where: { gameId: game.id, isDone: false },
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
      where: { gameId: game.id, isDone: false },
    });

    const gameAnswer = await this.prismaService.gameAnswer.findFirstOrThrow({
      where: { questionId: gameQuestion.id, isRight: true },
      select: { value: true },
    });

    this.logger.log(`Good answer for game ${gameId} is ${gameAnswer.value}`);

    return gameAnswer;
  }

  async checkGameState(gameId: string) {
    this.logger.log(`Checking game state for game ${gameId}`);

    const game = await this.prismaService.game.findUniqueOrThrow({ where: { id: gameId } });

    const isRoundEnded = await this.isRoundEnded(game.id);

    if (!isRoundEnded) return;

    const isGameEnded = await this.isGameEnded(game.id);

    if (isGameEnded) {
      this.gameEnd(game.id);
      return;
    }

    this.roundEnd(game.id);
  }

  async gameEnd(gameId: string) {
    const game = await this.prismaService.game.findUniqueOrThrow({ where: { id: gameId } });

    const goodAnswer = await this.getGoodAnswer(game.id);

    await this.setGameQuestionDone(game.id);

    const updateGameDto: Prisma.GameUpdateInput = {
      state: GameState.FINISHED,
    };

    await this.prismaService.game.update({
      where: { id: game.id },
      data: updateGameDto,
    });

    this.socketService.socket.to(game.joinCode).emit('on_game_end', { updateGameDto, goodAnswer });
  }

  async roundEnd(gameId: string) {
    const game = await this.prismaService.game.findUniqueOrThrow({ where: { id: gameId } });

    const goodAnswer = await this.getGoodAnswer(game.id);

    await this.setGameQuestionDone(game.id);

    this.socketService.socket.to(game.joinCode).emit('on_show_round_result', { goodAnswer });
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

  async setGameQuestionDone(gameId: string) {
    const gameQuestion = await this.prismaService.gameQuestion.findFirstOrThrow({
      where: { gameId, isDone: false },
    });

    this.logger.log(`Setting game question ${gameQuestion.id} as done for game ${gameId}`);

    await this.prismaService.gameQuestion.update({
      where: { id: gameQuestion.id },
      data: { isDone: true },
    });
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
