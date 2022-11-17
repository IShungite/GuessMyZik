import React from 'react'
import { useRecoilValue } from 'recoil'
import { gameState } from '../../atoms/gameAtom'
import PlaylistGrid from '../PlaylistsGrid/PlaylistGrid'
import SearchPlaylistInput from '../SearchPlaylistInput/SearchPlaylistInput'
import WaitingRoomCurrentPlaylist from '../WaitingRoomCurrentPlaylist/WaitingRoomCurrentPlaylist'

export default function WaitingRoomPlaylist() {

    return (
        <div>

            <div>
                WaitingRoomPlaylist
            </div>


            <SearchPlaylistInput />
            <PlaylistGrid />

            <WaitingRoomCurrentPlaylist />



        </div>
    )
}
