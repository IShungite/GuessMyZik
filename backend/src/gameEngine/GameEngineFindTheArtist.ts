/* eslint-disable no-underscore-dangle */
import { Logger } from '@nestjs/common';
import Track from '@Types/Deezer/Track';
import deezerService from 'src/deezer/deezer.service';
import shuffle from 'src/utils/shuffle';
import { GameEngine } from './GameEngine';

export default class GameEngineFindTheArtist extends GameEngine {
  public logger = new Logger('GameEngineFindTheArtist');

  public async getRandomSuggestions(track: Track): Promise<[string[], string]> {
    const similarArtists = await deezerService.getRandomSimilarArtists(
      track.artist.id,
      this.game.maxSuggestions - 1,
    );

    const rightSuggestion = track.artist.name;

    const suggestions = [rightSuggestion, ...similarArtists.map((artist) => artist.name)];

    const suggestionsShuffled = shuffle(suggestions);

    return [suggestionsShuffled, rightSuggestion];
  }
}
