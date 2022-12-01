import React from "react";
import { useSetRecoilState } from "recoil";
import Playlist from "../../@Types/Deezer/Playlist";
import { deezerPlaylistsSearchTermState } from "../../atoms/deezerPlaylistsAtom";

export default function PlaylistCardButton({ playlist, onClick }: { playlist: Playlist, onClick: (playlist: Playlist) => void }) {
  const setDeezerPlaylistSearchTerm = useSetRecoilState(deezerPlaylistsSearchTermState)

  const handleClickPlaylist = () => {
    onClick(playlist);
    setDeezerPlaylistSearchTerm("");
  };

  return (
    <div onClick={handleClickPlaylist} className="hover:bg-slate-900">
      <div>{playlist.title}</div>
      <img src={playlist.picture_medium} />
    </div>
  );
}
