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
