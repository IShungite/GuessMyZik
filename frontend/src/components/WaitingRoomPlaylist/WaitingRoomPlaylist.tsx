import React from 'react'
import { useRecoilValue } from 'recoil'
import { UpdateGameDto } from '../../@Types/Game'
import { gameState } from '../../atoms/gameAtom'
import PlaylistGrid from '../PlaylistsGrid/PlaylistGrid'
import SearchPlaylistInput from '../SearchPlaylistInput/SearchPlaylistInput'
import WaitingRoomCurrentPlaylist from '../WaitingRoomCurrentPlaylist/WaitingRoomCurrentPlaylist'

export default function WaitingRoomPlaylist({ updateGame }: { updateGame: (updateGameDto: UpdateGameDto) => void }) {

    return (
        <div>

            <WaitingRoomCurrentPlaylist />

            <div>
                Choose a playlist!
            </div>

            <SearchPlaylistInput />
            <PlaylistGrid updateGame={updateGame} />




        </div>
    )
}
