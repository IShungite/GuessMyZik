import React from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import Playlist from "../../@Types/Deezer/Playlist";
import Game, { UpdateGameDto } from "../../@Types/Game";
import { deezerPlaylistsSearchTermState } from "../../atoms/deezerPlaylistsAtom";
import { gameState } from "../../atoms/gameAtom";
import { backendApiUrl } from "../../constants";
import useFetch from "../../hooks/useFetch";

export default function PlaylistCardButton({ playlist, updateGame }: { playlist: Playlist, updateGame: (updateGameDto: UpdateGameDto) => void }) {
  const setDeezerPlaylistSearchTerm = useSetRecoilState(deezerPlaylistsSearchTermState)

  const handleClickPlaylist = () => {
    updateGame({ playlistId: playlist.id });
    setDeezerPlaylistSearchTerm("");
  };

  return (
    <div onClick={handleClickPlaylist} className="hover:bg-slate-900">
      <div>{playlist.title}</div>
      <img src={playlist.picture_medium} />
    </div>
  );
}
