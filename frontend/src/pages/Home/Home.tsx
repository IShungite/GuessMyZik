import React, { Suspense, useEffect } from 'react';
import { io } from 'socket.io-client';
import PlayButton from '../../components/PlayButton/PlayButton';
import PlaylistGrid from '../../components/PlaylistsGrid/PlaylistGrid';
import SearchPlaylistInput from '../../components/SearchPlaylistInput/SearchPlaylistInput';
import useWebsocket from '../../hooks/useWebsocket';

export default function Home() {

  const socket = useWebsocket({ url: 'http://localhost:3000' });

  return (
    <div>
      <div>

        Home
      </div>

      <PlayButton />
    </div>
  );
}
