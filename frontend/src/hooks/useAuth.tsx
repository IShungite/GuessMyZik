import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { authState } from '../atoms/authAtom';

export default function useAuth() {
    const [auth, setAuth] = useRecoilState(authState);

    const navigate = useNavigate();

    const logout = React.useCallback(() => {
        localStorage.removeItem('auth');
        setAuth(undefined);
        navigate(`/login`);
    }, [navigate]);

    return { auth, logout }
}
