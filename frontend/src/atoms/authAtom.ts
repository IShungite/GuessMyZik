import { atom } from 'recoil';
import { Credentials } from '../@Types/Auth/User';

export const authState = atom<Credentials | undefined>({
    key: 'auth',
    default: JSON.parse(localStorage.getItem("auth") || "null"),
    //default: undefined
});