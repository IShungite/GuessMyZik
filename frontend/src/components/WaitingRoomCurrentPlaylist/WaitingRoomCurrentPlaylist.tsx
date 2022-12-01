import React, { useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import Playlist from '../../@Types/Deezer/Playlist'
import { gamePlaylistIdAtom } from '../../atoms/gameAtom'
import { deezerApiUrl } from '../../constants'
import useFetch from '../../hooks/useFetch'
import PlaylistCard from '../PlaylistCard/PlaylistCard'

export default function WaitingRoomCurrentPlaylist() {
    const { data, isLoading, fetchData } = useFetch<Playlist>();

    const playlistId = useRecoilValue(gamePlaylistIdAtom);

    useEffect(() => {
        fetchData(`${deezerApiUrl}/playlist/${playlistId}`);

        console.log("new playlistId", playlistId);
    }, [playlistId])

    return (
        <div>
            <div>Current playlist</div>
            {isLoading ?
                <div>Loading...</div> :
                <>
                    {data && <PlaylistCard playlist={data} />}
                </>
            }
        </div>
    )
}
