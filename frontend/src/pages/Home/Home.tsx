import React from 'react';
import DisconnectButton from '../../components/DisconnectButton/DisconnectButton';
import JoinForm from '../../components/JoinForm/JoinForm';
import PlayButton from '../../components/PlayButton/PlayButton';

export default function Home() {

  return (
    <div>
      <div>
        Home
      </div>

      <PlayButton />

      <JoinForm />


      <DisconnectButton />
    </div>
  );
}
