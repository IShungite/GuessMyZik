import React, { Suspense } from 'react';
import PlaylistGrid from '../../components/PlaylistsGrid/PlaylistGrid';
import SearchPlaylistInput from '../../components/SearchPlaylistInput/SearchPlaylistInput';

export default function Home() {
  return (
    <div>
      Home
      <SearchPlaylistInput />
      <PlaylistGrid />
    </div>
  );
}
