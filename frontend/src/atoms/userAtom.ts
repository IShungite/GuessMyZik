import { atom } from "recoil";

export const userState = atom<{ username: string }>({
    key: 'user',
    default: { username: "Guest" },
});