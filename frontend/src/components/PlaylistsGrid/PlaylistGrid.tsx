import React from 'react';
import { useSetRecoilState } from 'recoil';
import Playlist from '../../@Types/Deezer/Playlist';
import { gamePlaylistIdAtom } from '../../atoms/gameAtom';
import UseDeezerPlaylists from '../../hooks/UseDeezerPlaylists';
import gameService from '../../services/gameService';
import socketService from '../../services/socketService';
import PlaylistCardButton from '../PlaylistCardButton/PlaylistCardButton';

export default function PlaylistGrid() {
  const { data, isLoading, error } = UseDeezerPlaylists();

  const setGamePlaylistId = useSetRecoilState(gamePlaylistIdAtom);

  const handlePlaylistClick = (playlist: Playlist) => {
    if (socketService.socket) {
      gameService.updateGame(socketService.socket, { playlistId: playlist.id });
      setGamePlaylistId(playlist.id);
    }
  }

  return (
    <div>
      {isLoading && <div>Loading...</div>}

      {error && <div>Error: {error.message}</div>}

      {data && (
        <div className='grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 '>
          {data.map((playlist) => <PlaylistCardButton key={playlist.id} playlist={playlist} onClick={handlePlaylistClick} />)}
        </div>
      )}
    </div>
  );
}
