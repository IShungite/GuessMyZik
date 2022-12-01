import { Injectable, Logger } from '@nestjs/common';
import {
  Game, GameState, Prisma,
} from '@prisma/client';
import Track from '@Types/Deezer/Track';
import { DeezerService } from 'src/deezer/deezer.service';
import { PrismaService } from 'src/prisma.service';
import shuffle from 'src/utils/shuffle';

@Injectable()
export class GamesService {
  constructor(private readonly prisma: PrismaService, private readonly deezerService: DeezerService) { }

  private logger: Logger = new Logger('GamesService');

  async create(): Promise<Game> {
    const joinCode = this.createJoinCode();
    const playlist = await this.deezerService.getRandomPlaylist();
    const maxQuestions = Math.ceil(playlist.nb_tracks / 2);

    const game = await this.prisma.game.create({
      data: { joinCode, playlistId: playlist.id, maxQuestions },
    });

    return game;
  }

  createJoinCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  async quitGame(joinCode: string, userId: string) {
    const game = await this.prisma.game.findFirst({ where: { joinCode } });

    if (!game) {
      throw new Error("Game doesn't exist");
    }

    const gamePlayer = await this.prisma.gamePlayer.findFirst(
      { where: { gameId: game.id, userId } },
    );

    if (!gamePlayer) {
      throw new Error("GamePlayer doesn't exist");
    }

    return this.prisma.gamePlayer.update(
      { where: { id: gamePlayer.id }, data: { isConnected: false } },
    );
  }

  async startGame(gameRoom: string) {
    const game = await this.prisma.game.findFirst({ where: { joinCode: gameRoom } });

    if (!game) {
      throw new Error("Game doesn't exist");
    }

    const tracks = await this.deezerService.getRandomPlaylistTracks(game.playlistId, game.maxQuestions);

    const gameQuestionsPromises = tracks.map((track) => this.prisma.gameQuestion.create({
      data: {
        trackId: track.id,
        gameId: game.id,
      },
    }));

    const gameQuestions = await Promise.all(gameQuestionsPromises);

    const gameUpdated = await this.prisma.game.update({
      where: { id: game.id },
      data: { state: GameState.PLAYING },
    });

    return gameUpdated;
  }

  async nextSong(gameRoom: string): Promise<{ gameAnswers: { value: string }[], track: Track }> {
    this.logger.log(`Setting next song for game ${gameRoom}`);

    const game = await this.prisma.game.findFirst({ where: { joinCode: gameRoom, state: GameState.PLAYING } });

    if (!game) {
      throw new Error("Game doesn't exist");
    }

    const gameQuestion = await this.prisma.gameQuestion.findFirst({
      where: { gameId: game.id, isDone: false },
    });

    if (!gameQuestion) {
      throw new Error('No more questions');
    }

    const track = await this.deezerService.getTrack(gameQuestion.trackId);

    this.logger.log(`Next song is ${track.title}`);

    const similarArtists = await this.deezerService.getRandomSimilarArtists(track.artist.id, game.maxSuggestions - 1);

    const suggestions = [track.artist.name, ...similarArtists.map((artist) => artist.name)];

    const suggestionsShuffled = shuffle(suggestions);

    const gameAnwserPromises = suggestionsShuffled.map((suggestion) => this.prisma.gameAnswer.create({
      data: {
        questionId: gameQuestion.id,
        value: suggestion,
      },
      select: { value: true },
    }));

    const gameAnswers = await Promise.all(gameAnwserPromises);

    return {
      gameAnswers,
      track,
    };
  }

  async sendAnswer(gameRoom: string, socketId: string, answer: string) {
    this.logger.log(`Sending answer ${answer} for game ${gameRoom}`);

    const game = await this.prisma.game.findFirst({ where: { joinCode: gameRoom, state: GameState.PLAYING } });

    if (!game) {
      throw new Error("Game doesn't exist");
    }

    const gamePlayer = await this.prisma.gamePlayer.findFirstOrThrow({ where: { gameId: game.id, socketId } });

    const gameQuestion = await this.prisma.gameQuestion.findFirstOrThrow({
      where: { gameId: game.id, isDone: false },
    });

    const gameAnswer = await this.prisma.gameAnswer.findFirstOrThrow({
      where: { questionId: gameQuestion.id, value: answer },
    });

    const answerAlreadySent = await this.prisma.gamePlayerAnswer.findFirst({
      where: { gameAnswerId: gameAnswer.id, gamePlayerId: gamePlayer.id },
    });

    if (answerAlreadySent) {
      throw new Error('Answer already sent');
    }

    await this.prisma.gamePlayerAnswer.create({
      data: {
        gamePlayerId: gamePlayer.id,
        gameAnswerId: gameAnswer.id,
      },
    });

    this.logger.log(`Answer ${answer} sent for game ${gameRoom}`);
  }

  async findAll() {
    return this.prisma.game.findMany();
  }

  async findOne(where: Prisma.GameWhereUniqueInput) {
    return this.prisma.game.findUnique({ where });
  }

  async findGamePlayers(where: Prisma.GamePlayerWhereInput) {
    return this.prisma.gamePlayer.findMany({
      where,
    });
  }

  async findFirst(where: Prisma.GameWhereInput) {
    return this.prisma.game.findFirstOrThrow({ where });
  }

  async update(id: string, updateGameDto: Prisma.GameUpdateInput) {
    return this.prisma.game.update({
      where: { id },
      data: updateGameDto,
    });
  }

  async remove(id: string) {
    return this.prisma.game.delete({ where: { id } });
  }

  async removeAll() {
    const { count } = await this.prisma.game.deleteMany();
    return count;
  }
}
