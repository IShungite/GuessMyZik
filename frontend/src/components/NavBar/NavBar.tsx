import React from 'react'
import { Link, useLocation } from 'react-router-dom';
import favicon from '../../assets/favicon.png'
import decodeJwt from '../../utils/decodeJwt';
import useAuth from '../../hooks/useAuth';

export default function NavBar() {
    const location = useLocation();

    const { auth, logout } = useAuth();

    const pathName = location.pathname;

    const handleClickLogout = () => {
        logout();
    }

    return (
        <nav className="bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-900">
            <div className="container flex flex-wrap items-center justify-between mx-auto">
                <Link to="/" className="flex items-center">
                    <img src={favicon} className="h-6 mr-3 sm:h-9" alt="GuessMyZik Logo" />
                    <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">GuessMyZik</span>
                </Link>
                <div className="flex items-center md:order-2">
                    {auth ?
                        <>
                            <button type="button" className="flex mr-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-600" id="user-menu-button" aria-expanded="false" data-dropdown-toggle="user-dropdown" data-dropdown-placement="bottom">
                                <span className="sr-only">Open user menu</span>
                                <div className="inline-flex overflow-hidden relative justify-center items-center w-8 h-8 bg-gray-300 rounded-full dark:bg-gray-600">
                                    <span className="font-medium text-gray-600 dark:text-gray-300"> {decodeJwt(auth.access_token).username.charAt(0).toUpperCase()}</span>
                                </div>
                            </button>

                            {/* <!-- Dropdown menu --> */}
                            <div className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600" id="user-dropdown">
                                <div className="px-4 py-3">
                                    <span className="block text-sm text-gray-900 dark:text-white">{decodeJwt(auth.access_token).username}</span>
                                    <span className="block text-sm font-medium text-gray-500 truncate dark:text-gray-400">{decodeJwt(auth.access_token).username}</span>
                                </div>
                                <ul className="py-1" aria-labelledby="user-menu-button">
                                    <li>
                                        <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Profile</Link>
                                    </li>
                                    <li>
                                        <a onClick={handleClickLogout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white cursor-pointer">Logout</a>
                                    </li>
                                </ul>
                            </div>
                        </>

                        :
                        <div className='flex space-x-4'>
                            <Link to="/login" className={`block py-2 pl-3 pr-4 rounded md:p-0 ${pathName === "/login" ? "text-white bg-blue-700 md:bg-transparent md:text-blue-700 dark:text-white" : "text-gray-700  hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700"}`}>Login</Link>
                            <Link to="/register" className={`block py-2 pl-3 pr-4 rounded md:p-0 ${pathName === "/register" ? "text-white bg-blue-700 md:bg-transparent md:text-blue-700 dark:text-white" : "text-gray-700  hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700"}`}>Register</Link>
                        </div>
                    }
                </div>
            </div>
        </nav>
    )
}
