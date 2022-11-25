import { Injectable } from '@nestjs/common';
import Artist from '@Types/Deezer/Artist';
import Playlist from '@Types/Deezer/Playlist';
import Track from '@Types/Deezer/Track';
import tryFetch from 'src/utils/tryFetch';

@Injectable()
export class DeezerService {
  async getPlaylistTracks(playlistId: string): Promise<Track[]> {
    const { data: tracks } = await tryFetch<{ data: Track[] }>(`https://api.deezer.com/playlist/${playlistId}/tracks`);

    return tracks;
  }

  async getSimilarArtists(artistId: string): Promise<Artist[]> {
    const { data: similarArtists } = await tryFetch<{ data: Artist[] }>(
      `https://api.deezer.com/artist/${artistId}/related`,
    );

    return similarArtists;
  }

  async searchPlaylist(query: string): Promise<Playlist[]> {
    const { data: playlists } = await tryFetch<{ data: Playlist[] }>(
      `https://api.deezer.com/search/playlist?q=${query}`,
    );

    return playlists;
  }

  async getAllGenres(): Promise<any> {
    const genres = await tryFetch<{ data: any[] }>('https://api.deezer.com/genre');

    return genres;
  }

  async getRandomPlaylist(): Promise<Playlist> {
    const genres = await this.getAllGenres();
    const randomGenre = genres.data[Math.floor(Math.random() * genres.data.length)];

    const playlists = await this.searchPlaylist(randomGenre.name);

    const randomPlaylist = playlists[Math.floor(Math.random() * playlists.length)];

    console.log(randomPlaylist);

    return randomPlaylist;
  }
}
