import { atom } from 'recoil';
import { Credentials } from '../@Types/Auth/User';

export const authState = atom<Credentials>({
    key: 'auth',
    default: undefined
});