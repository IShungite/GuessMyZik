import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { useDebounce } from "usehooks-ts";
import { deezerPlaylistsSearchTermState } from "../../atoms/deezerPlaylistsAtom";

export default function SearchPlaylistInput() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedValue = useDebounce<string>(searchTerm, 500);

  const deezerPlaylistsSearch = useSetRecoilState(deezerPlaylistsSearchTermState);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    deezerPlaylistsSearch(debouncedValue);
  }, [debouncedValue]);

  return <input className="border border-cyan-800 rounded-md" onChange={handleInputChange} />;
}
