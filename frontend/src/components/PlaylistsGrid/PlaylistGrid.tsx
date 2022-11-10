import React from "react";
import UseDeezerPlaylistsApi from "../../hooks/UseDeezerPlaylistsApi";
import PlaylistCard from "../PlaylistCard/PlaylistCard";

export default function PlaylistGrid() {
  const { data, isLoading, error } = UseDeezerPlaylistsApi();

  return (
    <div>
      <div>PlaylistGrid</div>
      {isLoading && <div>Loading...</div>}

      {error && <div>Error: {error.message}</div>}

      {data && data.map((playlist) => <PlaylistCard key={playlist.id} playlist={playlist} />)}
    </div>
  );
}
