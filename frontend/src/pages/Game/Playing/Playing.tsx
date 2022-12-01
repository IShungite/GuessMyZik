import React, { useEffect, useState } from 'react'
import gameService from '../../../services/gameService';
import socketService from '../../../services/socketService';
import { useAudioPlayer } from "react-use-audio-player"
import { Button } from 'flowbite-react';

export default function Playing() {
    const [gameAnswers, setGameAnswers] = useState<{ value: string }[]>([]);

    const { load } = useAudioPlayer({
        format: "mp3",
    })

    const handleNextSong = () => {
        if (socketService.socket) {
            gameService.onNextSong(socketService.socket, (trackPreview, gameAnswers) => {
                setGameAnswers(gameAnswers);
                load({ src: trackPreview, autoplay: true });
            });
        }
    }

    const handleClickAnswer = (answer: string) => {
        if (socketService.socket) {
            gameService.sendAnswer(socketService.socket, answer);
        }
    }

    useEffect(() => {
        handleNextSong();
    }, []);

    return (
        <div>
            <div>
                Playing
            </div>

            <div>
                {gameAnswers.map((gameAnswer) =>
                    <div key={gameAnswer.value}>
                        <Button onClick={() => handleClickAnswer(gameAnswer.value)}>
                            {gameAnswer.value}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
