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
import { GamePlayerAnswersService } from 'src/game-player-answers/game-player-answers.service';

interface IConstructorProps {
  game: Game,
  gamesService: GamesService,
  gamePlayersService: GamePlayersService
  gameQuestionsService: GameQuestionsService
  gameAnswersService: GameAnswersService
  gamePlayerAnswersService: GamePlayerAnswersService
  socketService: SocketService
}

export class GameEngine {
  private _gamesService: GamesService;

  private _gameQuestionsService: GameQuestionsService;

  private _gamePlayersService: GamePlayersService;

  private _gameAnswersService: GameAnswersService;

  private _gamePlayerAnswersService: GamePlayerAnswersService;

  private _socketService: SocketService;

  private _game: Game;

  private logger: Logger = new Logger('GameEngine');

  static JOIN_CODE_CHARS_NB = 8;

  constructor({
    game, gamesService, gamePlayersService, gameQuestionsService, gameAnswersService,
    gamePlayerAnswersService, socketService,
  }: IConstructorProps) {
    this._gamesService = gamesService;
    this._gamePlayersService = gamePlayersService;
    this._gameQuestionsService = gameQuestionsService;
    this._gameAnswersService = gameAnswersService;
    this._gamePlayerAnswersService = gamePlayerAnswersService;
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
    await Promise.all([
      this._createGameQuestions(),
      this._setGamePlaying(),
    ]);

    this._socketService.socket.to(this.roomCode).emit('on_game_start', { game: this._game });

    await this.nextSong();
  }

  public async nextSong() {
    await this._increaseCurrentQuestionNumber();

    const gameQuestion = await this.getCurrentGameQuestion();

    const track = await deezerService.getTrack(gameQuestion.trackId);

    this.logger.log(
      `The next song for the question ${gameQuestion.number} of the game ${this.roomCode} is ${track.title}`,
    );

    const [suggestions, rightSuggestion] = await this._getRandomSuggestions(track);

    const gameAnswers = await this.createGameAnswers(gameQuestion.id, suggestions, rightSuggestion);

    this._gamesService.startTimer(this.roomCode, this._game.id, () => { this._onTimerEnds(); });

    this._socketService.socket.to(this.roomCode).emit('on_next_song', { trackPreview: track.preview, gameAnswers });
  }

  public async getCurrentGameQuestion() {
    return this._gameQuestionsService.findByGameIdAndQuestionNumber(this._game.id, this._game.currentQuestionNumber);
  }

  public async getGamePlayer(socketId: string) {
    return this._gamePlayersService.findOneOrThrow({ where: { gameId: this._game.id, socketId } });
  }

  public async getGoodAnswer(gameQuestionId: string) {
    return this._gameAnswersService.findOneOrThrow({
      where: { questionId: gameQuestionId, isRight: true },
    });
  }

  public async updateGameParameters(updateGameDto: Prisma.GameUpdateInput, client: Socket) {
    this.logger.log(`Updating the game ${this.roomCode} with: ${JSON.stringify(updateGameDto)}`);

    await this.updateGame(updateGameDto);

    client.to(this.roomCode).emit('on_game_update', { updateGameDto });
  }

  public async sendAnswer(client: Socket, answer: string) {
    const timer = this._gamesService.getTimer(this._game.id);
    const TimerTimeElapsed = timer.timeElapsed;

    this.logger.log(
      `The player ${client.id} is sending answer ${answer} for game ${this.roomCode} in ${timer.timeElapsed}s`,
    );

    const [gamePlayer, gameQuestion] = await Promise.all([
      this.getGamePlayer(client.id),
      this.getCurrentGameQuestion(),
    ]);

    const gameAnswer = await this._gameAnswersService.findOneOrThrow({
      where: { questionId: gameQuestion.id, value: answer },
    });

    const isAnswerAlreadySent = await this.isAnswerAlreadySent(gameAnswer.id, gamePlayer.id);
    if (isAnswerAlreadySent) {
      throw new Error('Answer already sent');
    }

    const isGoodAnswer = await this._isGoodAnswer(gameQuestion.id, gameAnswer.id);

    await Promise.all([
      this._createGamePlayerAnswer(gamePlayer.id, gameAnswer.id),
      isGoodAnswer && this._increasePlayerScore(gamePlayer.id, TimerTimeElapsed, timer.duration),
    ]);

    client.to(this.roomCode).emit('on_answer_sent');

    this.logger.log(`The player ${client.id} has sent answer ${answer} for game ${this.roomCode}`);

    await this.updateGameState();
  }

  public async isAnswerAlreadySent(gameAnswerId: string, gamePlayerId: string) {
    return this._gamePlayerAnswersService.findOne({ where: { gameAnswerId, gamePlayerId } });
  }

  public async updateGameState() {
    this.logger.log(`Checking update game state for game ${this.roomCode}`);

    const isRoundEnded = await this.isRoundEnded();

    if (!isRoundEnded) return;

    this.roundEnd();

    const isGameEnded = await this.isGameEnded();
    if (isGameEnded) {
      await this.gameEnd();
    } else {
      await this.showGameQuestionResults();
    }
  }

  public async isRoundEnded() {
    this.logger.log(`Checking if round is ended for game ${this.roomCode}`);

    const allPlayersAnswered = await this.allPlayersAnswered();

    return allPlayersAnswered;
  }

  public async isGameEnded() {
    this.logger.log(`Checking if game is ended for game ${this.roomCode}`);

    const allQuestionsDone = this._game.currentQuestionNumber >= this._game.maxQuestions;

    this.logger.log(`Game is ended for game ${this.roomCode} : ${allQuestionsDone}`);

    return allQuestionsDone;
  }

  public async allPlayersAnswered() {
    this.logger.log(`Checking if all players answered for game ${this.roomCode}`);

    const gamePlayers = await this.getGamePlayers();
    const gamePlayersAnswers = await this.getGamePlayersAnswers();

    const allPlayersAnswered = gamePlayers.length === gamePlayersAnswers.length;

    this.logger.log(`All players answered for game ${this.roomCode} : ${allPlayersAnswered}`);

    return allPlayersAnswered;
  }

  public async getGamePlayers() {
    return this._gamePlayersService.findMany({ where: { gameId: this._game.id } });
  }

  public async getGamePlayersAnswers() {
    const gameQuestion = await this.getCurrentGameQuestion();

    return this._gamePlayerAnswersService.findMany({ where: { gameAnswer: { questionId: gameQuestion.id } } });
  }

  private async _isGoodAnswer(gameQuestionId: string, gameAnswerId: string) {
    const goodAnswer = await this.getGoodAnswer(gameQuestionId);
    return gameAnswerId === goodAnswer.id;
  }

  private async _increasePlayerScore(gamePlayerId: string, timeElapsed: number, timerDuration: number) {
    const score = this._calcAnswerScore(timeElapsed, timerDuration);

    this.logger.log(`gamePlayer ${gamePlayerId} won ${score} points`);

    await this._gamePlayersService.update({ where: { id: gamePlayerId }, data: { score: { increment: score } } });
  }

  private _calcAnswerScore(timeElapsed: number, duration: number) {
    const maxPoint = 500;
    const percent = (timeElapsed * 100) / duration;

    return Math.floor((percent * maxPoint) / 100);
  }

  private async _createGamePlayerAnswer(gamePlayerId: string, gameAnswerId: string) {
    return this._gamePlayerAnswersService.create({
      gamePlayerId,
      gameAnswerId,
    });
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

    await this.updateGame({
      currentQuestionNumber: nextGameQuestionNumber,
    });
  }

  private async _setGamePlaying() {
    return this.updateGame({ state: GameState.PLAYING });
  }

  private async _createGameQuestions() {
    const tracks = await deezerService.getRandomPlaylistTracks(this._game.playlistId, this._game.maxQuestions);

    const createGameQuestionsPromises = tracks.map((track, index) => this._gameQuestionsService.create({
      trackId: track.id,
      gameId: this._game.id,
      number: index + 1,
    }));

    await Promise.all(createGameQuestionsPromises);

    this.logger.log(`All game questions created successfully for game ${this.roomCode}`);
  }

  private async _onTimerEnds() {
    this.logger.log(`Timer of the game ${this.roomCode} has ended!`);

    this.roundEnd();

    const isGameEnded = await this.isGameEnded();
    if (isGameEnded) {
      await this.gameEnd();
    } else {
      await this.showGameQuestionResults();
    }
  }

  private async updateGame(data: Prisma.GameUpdateInput) {
    const gameUpdated = await this._gamesService.update({ where: { id: this._game.id }, data });

    this._game = gameUpdated;
  }

  public async gameEnd() {
    const gameQuestion = await this.getCurrentGameQuestion();
    const goodAnswer = await this.getGoodAnswer(gameQuestion.id);

    const updateGameDto: Prisma.GameUpdateInput = {
      state: GameState.FINISHED,
    };

    await this.updateGame(updateGameDto);

    this._socketService.socket.to(this.roomCode).emit('on_game_end', { updateGameDto, goodAnswer });
  }

  public roundEnd() {
    this._gamesService.stopTimer(this._game.id);
  }

  public async showGameQuestionResults() {
    const gameQuestion = await this.getCurrentGameQuestion();
    const goodAnswer = await this.getGoodAnswer(gameQuestion.id);

    const scoresWithGamePlayerId = await this._gamePlayersService.findMany({
      where: { gameId: this._game.id },
      select: { score: true, id: true },
    });

    this._socketService.socket.to(this.roomCode).emit('on_show_round_result', { goodAnswer, scoresWithGamePlayerId });
  }
}