import React from 'react';
import UseDeezerPlaylists from '../../hooks/UseDeezerPlaylists';
import PlaylistCard from '../PlaylistCard/PlaylistCard';
import PlaylistCardButton from '../PlaylistCardButton/PlaylistCardButton';

export default function PlaylistGrid() {
  const { data, isLoading, error } = UseDeezerPlaylists();

  return (
    <div>
      {isLoading && <div>Loading...</div>}

      {error && <div>Error: {error.message}</div>}

      {data && (
        <div className='grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 '>
          {data.map((playlist) => <PlaylistCardButton key={playlist.id} playlist={playlist} />)}
        </div>
      )}
    </div>
  );
}
