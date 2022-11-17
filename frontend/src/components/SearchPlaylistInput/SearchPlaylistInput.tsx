import React, { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useDebounce } from "usehooks-ts";
import { deezerPlaylistsSearchTermState } from "../../atoms/deezerPlaylistsAtom";

export default function SearchPlaylistInput() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedValue = useDebounce<string>(searchTerm, 500);

  const setDeezerPlaylistsSearchTerm = useSetRecoilState(deezerPlaylistsSearchTermState);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    setDeezerPlaylistsSearchTerm(debouncedValue);
  }, [debouncedValue]);

  return <input className="border border-cyan-800 rounded-md" onChange={handleInputChange} />;
}
