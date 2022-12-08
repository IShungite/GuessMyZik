/* eslint-disable no-underscore-dangle */
import { Logger } from '@nestjs/common';
import Track from '@Types/Deezer/Track';
import deezerService from 'src/deezer/deezer.service';
import shuffle from 'src/utils/shuffle';
import { GameEngine } from './GameEngine';

export default class GameEngineFindTheTrack extends GameEngine {
  public logger = new Logger('GameEngineFindTheTrack');

  async getRandomSuggestions(track: Track): Promise<[string[], string]> {
    const similarTracks = await deezerService.getRandomSimilarTracks(
      track.id,
      track.artist.id,
      this.game.maxSuggestions - 1,
    );

    const rightSuggestion = track.title;

    const suggestions = [rightSuggestion, ...similarTracks.map((similarTrack) => similarTrack.title)];

    const suggestionsShuffled = shuffle(suggestions);

    return [suggestionsShuffled, rightSuggestion];
  }
}
