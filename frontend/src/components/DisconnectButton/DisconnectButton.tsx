import { Button } from 'flowbite-react';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useResetRecoilState, useSetRecoilState } from 'recoil';
import { authState } from '../../atoms/authAtom';

export default function DisconnectButton() {

    const navigate = useNavigate();
    const resetCredentials = useSetRecoilState(authState);

    const handleClick = () => {
        localStorage.clear();
        resetCredentials(undefined);
        navigate(`/login`);
    }

    return (
        <Button onClick={handleClick}>
            Disconnect
        </Button>
    )
}