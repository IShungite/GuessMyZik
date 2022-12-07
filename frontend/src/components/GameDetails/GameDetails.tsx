import { Button, ListGroup, Modal } from "flowbite-react";
import { ListGroupItem } from "flowbite-react/lib/esm/components/ListGroup/ListGroupItem";
import React, { useEffect } from "react";
import { useRecoilValue } from "recoil";
import GameAnswer from "../../@Types/GameAnswer";
import { authState } from "../../atoms/authAtom";
import { backendApiUrl } from "../../constants";
import useFetch from "../../hooks/useFetch";

interface Props {
    gameId: string;
}

interface GameAnswers {
    gameAnswers: GameAnswer[];
    playerAnswers: GameAnswer[];
}

export default function GameDetails({ gameId }: Props) {

    const credentials = useRecoilValue(authState);

    useEffect(() => {
        fetchData(`${backendApiUrl}/stats/details/${gameId}/${credentials?.id}`, { method: 'GET' });
    }, [])

    const { data, isLoading, error, fetchData } = useFetch<GameAnswers>();

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    if (data) {

        const answers: string[] = [];

        for (let index = 0; index < data.gameAnswers.length; index += 1) {
            const gameAnswer = data.gameAnswers[index];
            const playerAnswer = data.playerAnswers[index];
            if (gameAnswer.isRight === playerAnswer.isRight) {
                answers.push(`${index + 1} => You picked ${playerAnswer.value}, this was correct.`);
            } else {
                answers.push(`${index + 1} => You picked ${playerAnswer.value}, this was incorrect. The correct answer was : ${gameAnswer.value}.`);
            }
        }


        return <React.Fragment>
            <Button onClick={handleOpen}>
                Show details
            </Button>
            <Modal show={open}>
                <Modal.Header>
                    Game Details
                </Modal.Header>
                <Modal.Body>
                    <ListGroup>
                        {answers &&

                            answers.map((answer) =>
                                <ListGroupItem>
                                    {answer}
                                </ListGroupItem>
                            )
                        }
                    </ListGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>;
    } else if (isLoading) {
        return <p>Loading...</p>
    } else {
        return <p>{error?.message}</p>
    }





}