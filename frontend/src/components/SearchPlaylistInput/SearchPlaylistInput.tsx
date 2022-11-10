import React from "react";
import { useSetRecoilState } from "recoil";
import { deezerPlaylistsSearchTermState } from "../../atoms/deezerPlaylistsAtom";

export default function SearchPlaylistInput() {
  const deezerPlaylistsSearch = useSetRecoilState(deezerPlaylistsSearchTermState);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    deezerPlaylistsSearch(event.target.value);
  };

  return <input className="border border-cyan-800 rounded-md" onChange={handleInputChange} />;
}
