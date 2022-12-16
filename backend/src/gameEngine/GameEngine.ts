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

export abstract class GameEngine {
  private _gamesService: GamesService;

  private _gameQuestionsService: GameQuestionsService;

  private _gamePlayersService: GamePlayersService;

  private _gameAnswersService: GameAnswersService;

  private _gamePlayerAnswersService: GamePlayerAnswersService;

  private _socketService: SocketService;

  private _game: Game;

  abstract logger: Logger;

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

  get game() {
    return this._game;
  }

  get roomCode() {
    return this.game.joinCode;
  }

  public async gameStart() {
    await Promise.all([
      this._createGameQuestions(),
      this._setGamePlaying(),
    ]);

    this._socketService.socket.to(this.roomCode).emit('on_game_start', { game: this.game });

    await this.nextSong();
  }

  public async nextSong() {
    await this._increaseCurrentQuestionNumber();

    const gameQuestion = await this.getCurrentGameQuestion();

    const track = await deezerService.getTrack(gameQuestion.trackId);

    this.logger.log(
      `The next song for the question ${gameQuestion.number} of the game ${this.roomCode} is ${track.title}`,
    );

    const [suggestions, rightSuggestion] = await this.getRandomSuggestions(track);

    const gameAnswers = await this.createGameAnswers(gameQuestion.id, suggestions, rightSuggestion);

    this._gamesService.startTimer(this.roomCode, this.game.id, this.game.timerDuration, () => { this._onTimerEnds(); });

    this._socketService.socket.to(this.roomCode).emit('on_next_song', { trackPreview: track.preview, gameAnswers });
  }

  public async getCurrentGameQuestion() {
    return this._gameQuestionsService.findByGameIdAndQuestionNumber(this.game.id, this.game.currentQuestionNumber);
  }

  public async getConnectedGamePlayer(socketId: string) {
    return this._gamePlayersService.findOneOrThrow({ where: { gameId: this.game.id, socketId, isConnected: true } });
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
    const timer = this._gamesService.getTimer(this.game.id);
    const TimerTimeElapsed = timer.timeElapsed;
    const TimerTimeRemaining = timer.timeRemaining;

    this.logger.log(
      `The player ${client.id} is sending answer ${answer} for game ${this.roomCode} in ${TimerTimeElapsed}s, time remaining: ${TimerTimeRemaining}s`,
    );

    const [gamePlayer, gameQuestion] = await Promise.all([
      this.getConnectedGamePlayer(client.id),
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
      isGoodAnswer && this._increasePlayerScore(gamePlayer.id, TimerTimeRemaining, timer.duration),
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

    await this._roundEnd();
  }

  public async isRoundEnded() {
    this.logger.log(`Checking if round is ended for game ${this.roomCode}`);

    const allPlayersAnswered = await this.allPlayersAnswered();

    return allPlayersAnswered;
  }

  public async isGameEnded() {
    this.logger.log(`Checking if game is ended for game ${this.roomCode}`);

    const allQuestionsDone = this.game.currentQuestionNumber >= this.game.maxQuestions;

    this.logger.log(`Game is ended for game ${this.roomCode} : ${allQuestionsDone}`);

    return allQuestionsDone;
  }

  public async allPlayersAnswered() {
    this.logger.log(`Checking if all players answered for game ${this.roomCode}`);

    const gamePlayers = await this.getConnectedGamePlayers();
    const gamePlayersAnswers = await this.getGamePlayersAnswers();

    const allPlayersAnswered = gamePlayers.length === gamePlayersAnswers.length;

    this.logger.log(`All players answered for game ${this.roomCode} : ${allPlayersAnswered}`);

    return allPlayersAnswered;
  }

  public async getConnectedGamePlayers() {
    return this._gamePlayersService.findMany({ where: { gameId: this.game.id, isConnected: true } });
  }

  public async getGamePlayersAnswers() {
    const gameQuestion = await this.getCurrentGameQuestion();

    return this._gamePlayerAnswersService.findMany({ where: { gameAnswer: { questionId: gameQuestion.id } } });
  }

  private async _isGoodAnswer(gameQuestionId: string, gameAnswerId: string) {
    const goodAnswer = await this.getGoodAnswer(gameQuestionId);
    return gameAnswerId === goodAnswer.id;
  }

  private async _increasePlayerScore(gamePlayerId: string, timeRemaining: number, timerDuration: number) {
    const score = this._calcAnswerScore(timeRemaining, timerDuration);

    this.logger.log(`gamePlayer ${gamePlayerId} won ${score} points`);

    await this._gamePlayersService.update({ where: { id: gamePlayerId }, data: { score: { increment: score } } });
  }

  private _calcAnswerScore(timeRemaining: number, duration: number) {
    const maxPoint = 500;
    const percent = (timeRemaining / duration);

    return Math.floor(percent * maxPoint);
  }

  private async _createGamePlayerAnswer(gamePlayerId: string, gameAnswerId: string) {
    return this._gamePlayerAnswersService.create({
      gamePlayerId,
      gameAnswerId,
    });
  }

  abstract getRandomSuggestions(track: Track): Promise<[string[], string]>;

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
    const nextGameQuestionNumber = this.game.currentQuestionNumber + 1;

    await this.updateGame({
      currentQuestionNumber: nextGameQuestionNumber,
    });
  }

  private async _setGamePlaying() {
    return this.updateGame({ state: GameState.PLAYING });
  }

  private async _createGameQuestions() {
    const tracks = await deezerService.getRandomPlaylistTracks(
      this.game.playlistId,
      this.game.maxQuestions,
      this.game.maxQuestions,
    );

    const createGameQuestionsPromises = tracks.map((track, index) => this._gameQuestionsService.create({
      trackId: track.id,
      gameId: this.game.id,
      number: index + 1,
    }));

    await Promise.all(createGameQuestionsPromises);

    this.logger.log(`All game questions created successfully for game ${this.roomCode}`);
  }

  private async _onTimerEnds() {
    this.logger.log(`Timer of the game ${this.roomCode} has ended!`);

    await this._roundEnd();
  }

  private async _roundEnd() {
    this.logger.log(`Round ${this.game.currentQuestionNumber} from game ${this.roomCode} ends`);

    this._gamesService.stopTimer(this.game.id);

    const isGameEnded = await this.isGameEnded();
    if (isGameEnded) {
      await this.gameEnd();
    } else {
      await this.showGameQuestionResults();
    }
  }

  private async updateGame(data: Prisma.GameUpdateInput) {
    const gameUpdated = await this._gamesService.update({ where: { id: this.game.id }, data });

    this._game = gameUpdated;
  }

  public async gameEnd() {
    this.logger.log(`Game ${this.roomCode} is ended`);

    const gameQuestion = await this.getCurrentGameQuestion();
    const goodAnswer = await this.getGoodAnswer(gameQuestion.id);

    const updateGameDto: Prisma.GameUpdateInput = {
      state: GameState.FINISHED,
    };

    await this.updateGame(updateGameDto);

    this._socketService.socket.to(this.roomCode).emit('on_game_end', { updateGameDto, goodAnswer });
  }

  public async showGameQuestionResults() {
    this.logger.log(`Show game question results for game ${this.roomCode}`);

    const gameQuestion = await this.getCurrentGameQuestion();
    const goodAnswer = await this.getGoodAnswer(gameQuestion.id);

    const scoresWithGamePlayerId = await this._gamePlayersService.findMany({
      where: { gameId: this.game.id, isConnected: true },
      select: { score: true, id: true },
    });

    this._socketService.socket.to(this.roomCode).emit('on_show_round_result', { goodAnswer, scoresWithGamePlayerId });
  }
}
