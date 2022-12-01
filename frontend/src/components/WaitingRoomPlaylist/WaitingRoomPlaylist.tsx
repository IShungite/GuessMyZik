import React from 'react'
import { useRecoilValue } from 'recoil'
import { isOwnerAtom } from '../../atoms/gameAtom'
import PlaylistGrid from '../PlaylistsGrid/PlaylistGrid'
import SearchPlaylistInput from '../SearchPlaylistInput/SearchPlaylistInput'
import WaitingRoomCurrentPlaylist from '../WaitingRoomCurrentPlaylist/WaitingRoomCurrentPlaylist'

export default function WaitingRoomPlaylist() {

    const isOwner = useRecoilValue(isOwnerAtom);

    return (
        <div>

            <WaitingRoomCurrentPlaylist />

            {isOwner && (
                <>
                    <div>
                        Choose a playlist!
                    </div>

                    <SearchPlaylistInput />
                    <PlaylistGrid />
                </>
            )}

        </div>
    )
}
