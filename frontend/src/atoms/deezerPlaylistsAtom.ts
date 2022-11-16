import { atom, selectorFamily } from 'recoil';
import Playlist from '../@Types/Deezer/Playlist';
import tryFetch from '../utils/tryFetch';
import { deezerApiUrl } from '../constants';

export const deezerPlaylistsState = atom<Playlist[]>({
  key: 'deezerPlaylists',
  default: [],
});

export const deezerPlaylistsSearchTermState = atom<string>({
  key: 'deezerPlaylistsSearchTerm',
  default: '',
});

export const deezerPlaylistsQuery = selectorFamily<Playlist[], string>({
  key: 'deezerPlaylistsQuery',
  get: (searchTerm) => async () => {
    if (searchTerm === '') return [];

    const { data } = await tryFetch<{ data: Playlist[] }>(`${deezerApiUrl}/search/playlist?q=${searchTerm}`);
    return data;
  },
});
