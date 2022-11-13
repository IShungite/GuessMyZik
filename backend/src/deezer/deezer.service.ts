import { Injectable } from '@nestjs/common';
import Artist from '@Types/Deezer/Artist';
import Track from '@Types/Deezer/Track';
import tryFetch from 'src/api/tryFetch';

@Injectable()
export class DeezerService {
  async getPlaylistTracks(playlistId: string): Promise<Track[]> {
    const tracks = await tryFetch<Track[]>(`https://api.deezer.com/playlist/${playlistId}/tracks`);

    return tracks;
  }

  async getSimilarArtists(artistId: string): Promise<Artist[]> {
    const similarArtists = await tryFetch<Artist[]>(`https://api.deezer.com/artist/${artistId}/related`);

    return similarArtists;
  }
}
