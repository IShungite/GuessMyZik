import React, { Suspense, useEffect } from 'react';
import { io } from 'socket.io-client';
import PlayButton from '../../components/PlayButton/PlayButton';
import PlaylistGrid from '../../components/PlaylistsGrid/PlaylistGrid';
import SearchPlaylistInput from '../../components/SearchPlaylistInput/SearchPlaylistInput';

export default function Home() {


  useEffect(() => {

    const socket = io('http://localhost:3000');

    socket.on('connect', () => {
      console.log('connected');

      socket.emit('test', { data: 'hello' }, (response: any) => {
        console.log("emit response: ", response);
      });
    });

    socket.on('hello', (response: any) => {
      console.log("hello response: ", response);
    });

    socket.on('disconnect', () => {
      console.log('disconnected');
    });

    return () => {
      socket.disconnect();
    }

  }, []);


  return (
    <div>
      <div>

        Home
      </div>

      <PlayButton />
    </div>
  );
}
