import React from "react";
import { useRecoilValue, useRecoilValueLoadable } from "recoil";
import { deezerPlaylistsQuery, deezerPlaylistsSearchTermState } from "../atoms/deezerPlaylistsAtom";

export default function UseDeezerPlaylistsApi() {
  const deezerPlaylistsSearchValue = useRecoilValue(deezerPlaylistsSearchTermState);
  const deezerPlaylists = useRecoilValueLoadable(deezerPlaylistsQuery(deezerPlaylistsSearchValue));

  const data = deezerPlaylists.state === "hasValue" ? deezerPlaylists.contents : undefined;
  const isLoading = deezerPlaylists.state === "loading";
  const error = deezerPlaylists.state === "hasError" ? deezerPlaylists.contents : null;

  return { data, isLoading, error };
}
