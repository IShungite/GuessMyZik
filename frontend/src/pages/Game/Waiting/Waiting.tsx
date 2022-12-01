import React from 'react'
import WaitingRoomGameJoinCode from '../../../components/WaitingRoomGameJoinCode/WaitingRoomGameJoinCode';
import WaitingRoomGameMaxPlayers from '../../../components/WaitingRoomGameMaxPlayers/WaitingRoomGameMaxPlayers';
import WaitingRoomGameMaxQuestions from '../../../components/WaitingRoomGameMaxQuestions/WaitingRoomGameMaxQuestions';
import WaitingRoomGameMode from '../../../components/WaitingRoomGameMode/WaitingRoomGameMode';
import WaitingRoomGamePlayers from '../../../components/WaitingRoomGamePlayers/WaitingRoomGamePlayers';
import WaitingRoomPlayButton from '../../../components/WaitingRoomPlayButton/WaitingRoomPlayButton';
import WaitingRoomPlaylist from '../../../components/WaitingRoomPlaylist/WaitingRoomPlaylist';
import WaitingRoomSuggestion from '../../../components/WaitingRoomSuggestion/WaitingRoomSuggestion';

export default function Waiting() {
    return (
        <div>

            <WaitingRoomGameJoinCode />

            <div className='flex justify-between'>
                <div>
                    <div className='underline mb-2'>Settings:</div>
                    <div className='ml-5'>
                        <WaitingRoomGameMode />
                        <WaitingRoomGameMaxPlayers />
                        <WaitingRoomGameMaxQuestions />
                        <WaitingRoomSuggestion />
                    </div>
                </div>

                <div className='text-center'>
                    <WaitingRoomPlaylist />
                </div>

                <WaitingRoomGamePlayers />
            </div>

            <WaitingRoomPlayButton />
        </div>
    )
}
