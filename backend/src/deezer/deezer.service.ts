import Artist from '@Types/Deezer/Artist';
import Playlist from '@Types/Deezer/Playlist';
import Track from '@Types/Deezer/Track';
import shuffle from 'src/utils/shuffle';
import tryFetch from 'src/utils/tryFetch';

class DeezerService {
  async getPlaylistTracks(playlistId: number, limit?: number): Promise<Track[]> {
    const { data: tracks } = await tryFetch<{ data: Track[] }>(
      `https://api.deezer.com/playlist/${playlistId}/tracks?limit=${limit}`,
    );

    const filteredTracks = tracks.filter((track) => track.preview !== '');

    return filteredTracks;
  }

  async getRandomPlaylistTracks(playlistId: number, maxTracks: number, limit?: number): Promise<Track[]> {
    const tracks = await this.getPlaylistTracks(playlistId, limit);

    const shuffledTacks = shuffle(tracks);

    return shuffledTacks.slice(0, maxTracks);
  }

  async getTrack(trackId: number): Promise<Track> {
    const track = await tryFetch<Track>(`https://api.deezer.com/track/${trackId}`);

    return track;
  }

  async getSimilarArtists(artistId: number): Promise<Artist[]> {
    const { data: similarArtists } = await tryFetch<{ data: Artist[] }>(
      `https://api.deezer.com/artist/${artistId}/related`,
    );

    return similarArtists;
  }

  async getRandomSimilarArtists(artistId: number, maxArtists: number): Promise<Artist[]> {
    const similarArtists = await this.getSimilarArtists(artistId);

    const shuffledSimilarArtists = shuffle(similarArtists);

    return shuffledSimilarArtists.slice(0, maxArtists);
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

    return randomPlaylist;
  }

  async getSimilarTracks(trackId: number, artistId: number): Promise<Track[]> {
    const { data: tracks } = await tryFetch<{ data: Track[] }>(`https://api.deezer.com/artist/${artistId}/radio`);

    const filteredTracks = tracks.filter((track) => track.preview !== '');
    const filteredTracks2 = filteredTracks.filter((track) => track.id !== trackId);

    return filteredTracks2;
  }

  async getRandomSimilarTracks(trackId: number, artistId: number, maxTracks: number): Promise<Track[]> {
    const similarTracks = await this.getSimilarTracks(trackId, artistId);

    const shuffledSimilarTracks = shuffle(similarTracks);

    return shuffledSimilarTracks.slice(0, maxTracks);
  }
}

export default new DeezerService();
