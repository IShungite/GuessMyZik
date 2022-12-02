import React from 'react'
import { useRecoilState } from 'recoil';
import { GameMode } from '../../@Types/Game';
import { gameModeAtom } from '../../atoms/gameAtom';
import gameService from '../../services/gameService';
import socketService from '../../services/socketService';

function enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
    return Object.keys(obj).filter(k => Number.isNaN(+k)) as K[];
}

export default function WaitingRoomGameMode() {
    const [gameMode, setGameMode] = useRecoilState(gameModeAtom);


    const handleChangeGameMode = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newGameMode = e.target.value as GameMode;

        if (socketService.socket) {
            gameService.updateGame(socketService.socket, { gameMode: newGameMode });
            setGameMode(newGameMode);
        }
    }

    return (
        <div className='flex'>
            <div>Game mode:</div>
            <select onChange={handleChangeGameMode} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                {enumKeys(GameMode).map((key) => (
                    <option key={key} value={key} defaultValue={gameMode}>{key}</option>
                ))}
            </select>
        </div>
    )
}
