import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { authState } from '../../atoms/authAtom';
import { isOwnerAtom } from '../../atoms/gameAtom';
import useUpdateGame from '../../hooks/useUpdateGame';
import gameService from '../../services/gameService';
import socketService from '../../services/socketService';

export default function JoinForm() {
    const [joinCode, setJoinCode] = React.useState('');
    const [isJoining, setIsJoining] = React.useState(false);
    const setIsOwner = useSetRecoilState(isOwnerAtom);

    const auth = useRecoilValue(authState);

    const { updateGame } = useUpdateGame();

    const navigate = useNavigate();

    if (!auth) return null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const socket = socketService.socket;

        if (!socket || !joinCode || joinCode.trim() === '') return;

        setIsJoining(true);

        try {
            const gameJoined = await gameService.joinGameRoom(socket, joinCode, auth.id);

            if (gameJoined) {
                setIsOwner(false);
                updateGame(gameJoined);
                navigate('/game');
            }

        } catch (e: any) {
            alert(e.error);
        } finally {
            setIsJoining(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className='flex space-x-2' >
            <input className='border border-violet-500 w-28 text-2xl pr-2 pl-2' maxLength={6} onChange={(e) => setJoinCode(e.target.value.toUpperCase())} value={joinCode} />
            <button type="submit" className={`text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-xl px-5 py-2.5 text-center ${isJoining && 'disabled:bg-gray-500'}`} disabled={isJoining}>{isJoining ? "Joining..." : "Join"}</button>
        </form>
    )
}
