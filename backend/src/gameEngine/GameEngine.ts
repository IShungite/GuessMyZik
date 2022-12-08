/* eslint-disable no-underscore-dangle */
import { Logger } from '@nestjs/common';
import {
  Game, GameState, Prisma,
} from '@prisma/client';
import Track from '@Types/Deezer/Track';
import deezerService from 'src/deezer/deezer.service';
import { GameAnswersService } from 'src/game-answers/game-answers.service';
import { GamePlayersService } from 'src/game-players/game-players.service';
import { GameQuestionsService } from 'src/game-questions/game-questions.service';
import { GamesService } from 'src/games/games.service';
import { SocketService } from 'src/socket.service';
import { Socket } from 'socket.io';
import shuffle from 'src/utils/shuffle';

interface IConstructorProps {
  game: Game,
  gamesService: GamesService,
  gamePlayersService: GamePlayersService
  gameQuestionsService: GameQuestionsService
  gameAnswersService: GameAnswersService
  socketService: SocketService
}

export class GameEngine {
  private _gamesService: GamesService;

  private _gameQuestionsService: GameQuestionsService;

  private _gamePlayersService: GamePlayersService;

  private _gameAnswersService: GameAnswersService;

  private _socketService: SocketService;

  private _game: Game;

  private logger: Logger = new Logger('GameEngine');

  static JOIN_CODE_CHARS_NB = 8;

  constructor({
    game, gamesService, gamePlayersService, gameQuestionsService, gameAnswersService, socketService,
  }: IConstructorProps) {
    this._gamesService = gamesService;
    this._gamePlayersService = gamePlayersService;
    this._gameQuestionsService = gameQuestionsService;
    this._gameAnswersService = gameAnswersService;
    this._socketService = socketService;

    this._game = game;
  }

  static createJoinCode() {
    return Math.random().toString(36).substring(2, this.JOIN_CODE_CHARS_NB).toUpperCase();
  }

  static async GetDataToCreateGame() {
    const joinCode = this.createJoinCode();
    const playlist = await deezerService.getRandomPlaylist();
    const maxQuestions = Math.ceil(playlist.nb_tracks / 2);

    return {
      joinCode,
      playlist,
      maxQuestions,
    };
  }

  get roomCode() {
    return this._game.joinCode;
  }

  public async gameStart() {
    await this._createGameQuestions();
    const gameUpdated = await this._setGamePlaying();

    this._socketService.socket.to(this.roomCode).emit('on_game_start', { game: gameUpdated });

    await this.nextSong();
  }

  public async nextSong() {
    const gameQuestion = await this.getCurrentGameQuestion();

    const track = await deezerService.getTrack(gameQuestion.trackId);

    this.logger.log(
      `The next song for the question ${gameQuestion.number} of the game ${this.roomCode} is ${track.title}`,
    );

    const [suggestions, rightSuggestion] = await this._getRandomSuggestions(track);

    const gameAnswers = await this.createGameAnswers(gameQuestion.id, suggestions, rightSuggestion);

    await this._increaseCurrentQuestionNumber();

    this._gamesService.startTimer(this.roomCode, this._game.id);

    this._socketService.socket.to(this.roomCode).emit('on_next_song', { trackPreview: track.preview, gameAnswers });
  }

  public async getCurrentGameQuestion() {
    return this._gameQuestionsService.findByGameIdAndQuestionNumber(this._game.id, this._game.currentQuestionNumber);
  }

  public async updateGameParameters(updateGameDto: Prisma.GameUpdateInput, client: Socket) {
    this.logger.log(`Updating the game ${this.roomCode} with: ${JSON.stringify(updateGameDto)}`);

    await this._gamesService.update({ where: { id: this._game.id }, data: updateGameDto });

    client.to(this.roomCode).emit('on_game_update', { updateGameDto });
  }

  private async _getRandomSuggestions(track: Track): Promise<[string[], string]> {
    const similarArtists = await deezerService.getRandomSimilarArtists(track.artist.id, this._game.maxSuggestions - 1);

    const suggestions = [track.artist.name, ...similarArtists.map((artist) => artist.name)];

    const suggestionsShuffled = shuffle(suggestions);

    const rightSuggestion = track.artist.name;

    return [suggestionsShuffled, rightSuggestion];
  }

  private async createGameAnswers(gameQuestionId: string, suggestions: string[], rightSuggestion: string) {
    const createGameAnswersPromises = suggestions.map(
      (suggestion) => this._gameAnswersService.create(
        { questionId: gameQuestionId, value: suggestion, isRight: suggestion === rightSuggestion },
      ),
    );

    const gameAnswers = await Promise.all(createGameAnswersPromises);

    this.logger.log(`Game answers for the next song of the game: ${this.roomCode} have been created`);

    return gameAnswers;
  }

  private async _increaseCurrentQuestionNumber() {
    const nextGameQuestionNumber = this._game.currentQuestionNumber + 1;

    await this._gamesService.update({
      where: { id: this._game.id },
      data: {
        currentQuestionNumber: nextGameQuestionNumber,
      },
    });
  }

  private async _setGamePlaying() {
    return this._gamesService.update({ where: { id: this._game.id }, data: { state: GameState.PLAYING } });
  }

  private async _createGameQuestions() {
    const tracks = await deezerService.getRandomPlaylistTracks(this._game.playlistId, this._game.maxQuestions);

    const createGameQuestionsPromises = tracks.map((track, index) => this._gameQuestionsService.create({
      trackId: track.id,
      gameId: this._game.id,
      number: index,
    }));

    await Promise.all(createGameQuestionsPromises);

    this.logger.log(`All game questions created successfully for game ${this.roomCode}`);
  }

  public gameEnd() {

  }

  public roundEnd() {

  }
}
