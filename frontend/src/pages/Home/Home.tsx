import React from 'react';
import JoinForm from '../../components/JoinForm/JoinForm';
import PlayButton from '../../components/PlayButton/PlayButton';

export default function Home() {

  return (
    <div className='flex text-center justify-center space-x-8 items-center mt-10'>
      <div className='max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-md  dark:bg-gray-800 dark:border-gray-700'>
        <div className="mb-2">Create a new game</div>
        <PlayButton />
      </div >

      <div className='max-w-sm min-h-max p-6 bg-white border border-gray-200 rounded-lg shadow-md  dark:bg-gray-800 dark:border-gray-700'>
        <div className="mb-2">Join a game</div>
        <JoinForm />
      </div>
    </div >
  );
}
