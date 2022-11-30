import React from 'react'
import { useRecoilValue } from 'recoil'
import { UpdateGameDto } from '../../@Types/Game'
import { authState } from '../../atoms/authAtom'
import { gameState } from '../../atoms/gameAtom'
import PlaylistGrid from '../PlaylistsGrid/PlaylistGrid'
import SearchPlaylistInput from '../SearchPlaylistInput/SearchPlaylistInput'
import WaitingRoomCurrentPlaylist from '../WaitingRoomCurrentPlaylist/WaitingRoomCurrentPlaylist'

export default function WaitingRoomPlaylist({ updateGame }: { updateGame: (updateGameDto: UpdateGameDto) => void }) {

    const game = useRecoilValue(gameState);
    const auth = useRecoilValue(authState);

    if (!game || !auth) return null;


    const isOwner = game.gamePlayers.find((gp) => gp.isOwner && gp.userId === auth.id)


    return (
        <div>

            <WaitingRoomCurrentPlaylist />

            {isOwner && (
                <>
                    <div>
                        Choose a playlist!
                    </div>

                    <SearchPlaylistInput />
                    <PlaylistGrid updateGame={updateGame} />
                </>
            )}




        </div>
    )
}
