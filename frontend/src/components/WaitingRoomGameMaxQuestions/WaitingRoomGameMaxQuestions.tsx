import React from 'react'
import { useRecoilState, useRecoilValue } from 'recoil';
import { gameMaxQuestionsAtom, gameTotalPlaylistTrackAtom, isOwnerAtom } from '../../atoms/gameAtom';
import gameService from '../../services/gameService';
import socketService from '../../services/socketService';

export default function WaitingRoomGameMaxQuestions() {
    const [maxQuestions, setMaxQuestions] = useRecoilState(gameMaxQuestionsAtom);
    const totalPlaylistTracks = useRecoilValue(gameTotalPlaylistTrackAtom);
    const isOwner = useRecoilValue(isOwnerAtom)


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        const newRange = parseInt(e.target.value);

        if (socketService.socket) {
            gameService.updateGame(socketService.socket, { maxQuestions: newRange });
            setMaxQuestions(newRange);
        }
    }

    return (
        <div>
            {isOwner ?
                <>
                    <label htmlFor="minmax-range" className="block mb-2">Max questions: {maxQuestions}</label>
                    <div className='flex flex-row items-center space-x-3'>
                        <div>1</div>
                        <input id="minmax-range" type="range" min="1" max={totalPlaylistTracks} value={maxQuestions} step="1" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" onChange={handleChange} />
                        <div>{totalPlaylistTracks}</div>
                    </div>
                </> :
                <div>Max questions: {maxQuestions}</div>
            }
        </div>
    )
}
