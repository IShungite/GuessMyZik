import { Button, Modal } from "flowbite-react";
import React, { useEffect } from "react";
import Game from "../../@Types/Game";
import { backendApiUrl } from "../../constants";
import useFetch from "../../hooks/useFetch";

interface Props {
    gameId: string;
}

export default function GameDetails({ gameId }: Props) {

    useEffect(() => {
        fetchData(`${backendApiUrl}/stats/details/${gameId}`, { method: 'GET' });
    }, [])

    const { data, isLoading, error, fetchData } = useFetch<Game[]>();

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return <React.Fragment>
        <Button onClick={handleOpen}>
            Show details
        </Button>
        <Modal
            show={open}
        >
            <Modal.Header>
                Game Details
            </Modal.Header>
            <Modal.Body>
                <div className="space-y-6">
                    <p>TODO</p>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    </React.Fragment>



}