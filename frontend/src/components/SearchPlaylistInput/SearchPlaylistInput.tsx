import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useDebounce } from "usehooks-ts";
import { deezerPlaylistsSearchTermState } from "../../atoms/deezerPlaylistsAtom";

export default function SearchPlaylistInput() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedValue = useDebounce<string>(searchTerm, 500);

  const [deezerPlaylistsSearchTerm, setDeezerPlaylistsSearchTerm] = useRecoilState(deezerPlaylistsSearchTermState);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    setDeezerPlaylistsSearchTerm(debouncedValue);
  }, [debouncedValue]);

  useEffect(() => {
    setSearchTerm(deezerPlaylistsSearchTerm);
  }, [deezerPlaylistsSearchTerm]);

  return <input className="border border-cyan-800 rounded-md" value={searchTerm} onChange={handleInputChange} />;
}
