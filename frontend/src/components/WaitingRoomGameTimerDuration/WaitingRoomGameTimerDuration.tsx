import React from 'react'
import { useRecoilState, useRecoilValue } from 'recoil';
import { gameMaxQuestionsAtom, gameTimerDurationAtom, gameTotalPlaylistTrackAtom, isOwnerAtom } from '../../atoms/gameAtom';
import gameService from '../../services/gameService';
import socketService from '../../services/socketService';

export default function WaitingRoomGameTimerDuration() {
    const [timerDuration, setTimerDuration] = useRecoilState(gameTimerDurationAtom);
    const isOwner = useRecoilValue(isOwnerAtom)


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        const newRange = parseInt(e.target.value);

        if (socketService.socket) {
            gameService.updateGame(socketService.socket, { timerDuration: newRange });
            setTimerDuration(newRange);
        }
    }

    return (
        <div>
            {isOwner ?
                <>
                    <label htmlFor="minmax-range" className="block mb-2">Timer duration: {timerDuration}</label>
                    <div className='flex flex-row items-center space-x-3'>
                        <div>5</div>
                        <input id="minmax-range" type="range" min={5} max={30} value={timerDuration} step="1" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" onChange={handleChange} />
                        <div>30</div>
                    </div>
                </> :
                <div>Timer duration: {timerDuration}</div>
            }
        </div>
    )
}
