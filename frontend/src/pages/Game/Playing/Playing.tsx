import React, { useEffect, useState } from 'react'
import { useAudioPlayer } from "react-use-audio-player"
import { useRecoilValue } from 'recoil';
import { gameTrackPreviewAtom } from '../../../atoms/gameAtom';
import GamePlayingAnswers from '../../../components/GamePlayingAnswers/GamePlayingAnswers';

export default function Playing() {
    const trackPreview = useRecoilValue(gameTrackPreviewAtom)

    const { } = useAudioPlayer({
        src: trackPreview,
        autoplay: true,
        format: "mp3",
    })

    return (
        <div>
            <div>
                Playing
            </div>

            <GamePlayingAnswers />
        </div>
    )
}
