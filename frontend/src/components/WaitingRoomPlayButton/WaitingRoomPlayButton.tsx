import { Button } from 'flowbite-react';
import React from 'react'
import { useRecoilValue } from 'recoil';
import { isOwnerAtom } from '../../atoms/gameAtom';
import gameService from '../../services/gameService';
import socketService from '../../services/socketService';

export default function WaitingRoomPlayButton() {
    const isOwner = useRecoilValue(isOwnerAtom);

    if (!isOwner) {
        return null;
    }

    const handleClickPlay = () => {
        if (socketService.socket) {
            gameService.startGame(socketService.socket)
        }
    }

    return (
        <Button onClick={handleClickPlay}>Play!</Button>
    )
}
