import React from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import Playlist from "../../@Types/Deezer/Playlist";
import Game from "../../@Types/Game";
import { deezerPlaylistsSearchTermState } from "../../atoms/deezerPlaylistsAtom";
import { gameState } from "../../atoms/gameAtom";
import useFetch from "../../hooks/useFetch";

export default function PlaylistCardButton({ playlist }: { playlist: Playlist }) {
  const [game, setGame] = useRecoilState(gameState);
  const setDeezerPlaylistSearchTerm = useSetRecoilState(deezerPlaylistsSearchTermState)

  const { data: gameUpdated, error, fetchData } = useFetch<Game>("http://localhost:3000/games/" + game.id, { method: "PATCH", body: JSON.stringify({ playlistId: playlist.id }), headers: { "Content-Type": "application/json" } });

  const handleClickPlaylist = () => {
    fetchData();
    setDeezerPlaylistSearchTerm("");
  };

  React.useEffect(() => {
    if (gameUpdated) {
      setGame(gameUpdated);
    }
  }, [gameUpdated]);

  return (
    <div onClick={handleClickPlaylist} className="hover:bg-slate-900">
      <div>{playlist.title}</div>
      <img src={playlist.picture_medium} />
    </div>
  );
}
