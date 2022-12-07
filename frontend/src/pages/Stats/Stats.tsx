import { Table } from 'flowbite-react';
import React, { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import Game from '../../@Types/Game';
import { authState } from '../../atoms/authAtom';
import { backendApiUrl } from '../../constants';
import useFetch from '../../hooks/useFetch';

export default function Stats() {

    useEffect(() => {
        fetchData(`${backendApiUrl}/stats/played`, { method: 'GET' });
    }, [])

    const { data, isLoading, error, fetchData } = useFetch<Game[]>();

    if (data) {
        return <div>
            <p>Games played : {data.length}</p>
            <p>Games won : 0</p>
            <Table hoverable={true}>
                <Table.Head>
                    <Table.HeadCell>
                        Game ID
                    </Table.HeadCell>
                    <Table.HeadCell>
                        Game mode
                    </Table.HeadCell>
                    <Table.HeadCell>
                        Playlist ID
                    </Table.HeadCell>
                    <Table.HeadCell>
                        Result
                    </Table.HeadCell>
                    <Table.HeadCell>
                        <span className="sr-only">
                            View details
                        </span>
                    </Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">

                    {data.map((game) =>
                        <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{game.id}</Table.Cell>
                            <Table.Cell>{game.gameMode}</Table.Cell>
                            <Table.Cell>{game.playlistId}</Table.Cell>
                            <Table.Cell>Not implemented</Table.Cell>
                            <Table.Cell className="font-medium text-blue-600 hover:underline dark:text-blue-500">
                                <a href='/stats'>Details</a>
                            </Table.Cell>
                        </Table.Row>
                    )}

                    {/* {birthdayArray.map(({ name, birthday, id }) => (
                        <p key={id}> {name}'s birthday is on {birthday} </p>
                    ))} */}

                </Table.Body>
            </Table>
        </div>;
    } else if (isLoading) {
        return <div>
            Loading
        </div>;
    } else {
        return <div>
            <p>{error?.message}</p>
        </div>;
    }


}
