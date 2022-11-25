import React from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { authState } from '../../atoms/authAtom';

export default function Header() {

  const [getAuth, setAuth] = useRecoilState(authState);

  return (
    <header>
      <nav className="space-x-2 underline">
        <Link to="/">Home</Link>
        {getAuth &&
          <Link to="/profile">Profile</Link>
        }
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </nav>
    </header>
  );
}
