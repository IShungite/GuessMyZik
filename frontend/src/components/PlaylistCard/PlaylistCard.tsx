import React from "react";
import Playlist from "../../@Types/Deezer/Playlist";

export default function PlaylistCard({ playlist }: { playlist: Playlist }) {
  return (
    <div>
      <div>{playlist.title}</div>
      <img src={playlist.picture_medium} />
    </div>
  );
}
