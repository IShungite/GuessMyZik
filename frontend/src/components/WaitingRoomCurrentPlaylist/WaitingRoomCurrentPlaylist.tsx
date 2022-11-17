import React from 'react'
import { useRecoilValue } from 'recoil'
import { gameState } from '../../atoms/gameAtom'
import PlaylistCard from '../PlaylistCard/PlaylistCard'

export default function WaitingRoomCurrentPlaylist() {
    const game = useRecoilValue(gameState)

    if (!game) {
        return null;
    }

    return (
        <div>

            {game.playlistId ?
                <div>
                    Current playlist: {game.playlistId}
                    {/* <PlaylistCard playlist={gameConfigPlaylist.} /> */}
                </div>
                : <div>no playlist selected</div>}
        </div>
    )
}
