import React from "react";
import Playlist from "../../@Types/Deezer/Playlist";

export default function PlaylistCard({ playlist }: { playlist: Playlist }) {
  return (
    <div className="p-3 border border-cyan-400 inline-block" >
      <div>{playlist.title}</div>
      <img className="w-32" src={playlist.picture_medium} />
    </div>
  );
}
