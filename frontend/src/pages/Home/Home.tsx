import React, { Suspense } from 'react';
import DisconnectButton from '../../components/DisconnectButton/DisconnectButton';
import PlayButton from '../../components/PlayButton/PlayButton';
import PlaylistGrid from '../../components/PlaylistsGrid/PlaylistGrid';
import SearchPlaylistInput from '../../components/SearchPlaylistInput/SearchPlaylistInput';

export default function Home() {

  return (
    <div>
      <div>

        Home
      </div>

      <PlayButton />
      <DisconnectButton />
    </div>
  );
}
