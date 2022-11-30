import React from 'react'
import { useRecoilValue } from 'recoil';
import { UpdateGameDto } from '../../@Types/Game'
import { authState } from '../../atoms/authAtom';
import { gameState } from '../../atoms/gameAtom';

export default function WaitingRoomSuggestion({ updateGame }: { updateGame: (updateGameDto: UpdateGameDto) => void }) {
    const game = useRecoilValue(gameState);
    const auth = useRecoilValue(authState);

    const [range, setRange] = React.useState(game.maxSuggestions);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        const newRange = parseInt(e.target.value);
        updateGame({ maxSuggestions: newRange });
        setRange(newRange)
    }

    if (!game || !auth) return null;


    const isOwner = game.gamePlayers.find((gp) => gp.isOwner && gp.userId === auth.id)

    return (
        <div>
            {isOwner ?
                <>
                    <label htmlFor="minmax-range" className="block mb-2">Suggestion number: {range}</label>
                    <div className='flex flex-col'>
                        <div>1</div>
                        <input id="minmax-range" type="range" min="1" max="8" value={range} step="1" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" onChange={handleChange} />
                        <div>8</div>
                    </div>
                </> :
                <div>Suggestion number: {game.maxSuggestions}</div>
            }

        </div>
    )
}
