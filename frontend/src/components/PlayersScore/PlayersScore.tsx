import { Table } from 'flowbite-react'
import React from 'react'
import { useRecoilValue } from 'recoil';
import { gamePlayersAtom } from '../../atoms/gameAtom';

export default function PlayersScore() {
  const gamePlayers = useRecoilValue(gamePlayersAtom);

  const gamePlayersSorted = gamePlayers.slice().sort((a, b) => b.score - a.score);

  return (
    <div>
      <Table hoverable={true}>
        <Table.Head>
          <Table.HeadCell>
            Rank
          </Table.HeadCell>
          <Table.HeadCell>
            Username
          </Table.HeadCell>
          <Table.HeadCell>
            Score
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {gamePlayersSorted.map((gamePlayer, index) =>
            <Table.Row key={gamePlayer.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{index + 1}</Table.Cell>
              <Table.Cell>{gamePlayer.username}</Table.Cell>
              <Table.Cell>{gamePlayer.score}</Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </div>
  )
}
