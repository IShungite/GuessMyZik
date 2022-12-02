import React from 'react'
import { useRecoilState, useRecoilValue } from 'recoil';
import { authState } from '../../atoms/authAtom';
import { gameMaxSuggestionsAtom, isOwnerAtom } from '../../atoms/gameAtom';
import gameService from '../../services/gameService';
import socketService from '../../services/socketService';

export default function WaitingRoomSuggestion() {
    const isOwner = useRecoilValue(isOwnerAtom)

    const [gameMaxSuggestions, setGameMaxSuggestions] = useRecoilState(gameMaxSuggestionsAtom)


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        const newRange = parseInt(e.target.value);

        if (socketService.socket) {
            gameService.updateGame(socketService.socket, { maxSuggestions: newRange });
            setGameMaxSuggestions(newRange);
        }
    }

    return (
        <div>
            {isOwner ?
                <>
                    <label htmlFor="minmax-range" className="block mb-2">Suggestion number: {gameMaxSuggestions}</label>
                    <div className='flex flex-row items-center space-x-3'>
                        <div>1</div>
                        <input id="minmax-range" type="range" min="1" max="8" value={gameMaxSuggestions} step="1" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" onChange={handleChange} />
                        <div>8</div>
                    </div>
                </> :
                <div>Suggestion number: {gameMaxSuggestions}</div>
            }
        </div>
    )
}
