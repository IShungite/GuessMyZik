import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { authState } from '../../atoms/authAtom';
import { gameState, isInGameState } from '../../atoms/gameAtom';
import gameService from '../../services/gameService';
import socketService from '../../services/socketService';

export default function JoinForm() {
    const [joinCode, setJoinCode] = React.useState('');
    const [isJoining, setIsJoining] = React.useState(false);

    const setIsInGame = useSetRecoilState(isInGameState);
    const setGame = useSetRecoilState(gameState);

    const auth = useRecoilValue(authState);

    const navigate = useNavigate();

    if (!auth) return null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const socket = socketService.socket;

        if (!socket || !joinCode || joinCode.trim() === '') return;

        setIsJoining(true);

        try {
            const gameJoined = await gameService.joinGameRoom(socket, joinCode, auth.username);

            if (gameJoined) {
                console.log('joined game room');
                setIsInGame(true);
                setGame(gameJoined);
                navigate('/game');
            }

        } catch (e: any) {
            alert(e.error);
        } finally {
            setIsJoining(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input className='border border-violet-500' onChange={(e) => setJoinCode(e.target.value)} value={joinCode} />
            <button className={`bg-orange-200 hover:bg-orange-300 pt-2 pb-2 pl-5 pr-5 ${isJoining && 'disabled:bg-gray-500'}`} disabled={isJoining} type="submit" >{isJoining ? "Joining..." : "Join"}</button>
        </form>
    )
}
