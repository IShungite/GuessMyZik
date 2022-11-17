import React from 'react'
import tryFetch from '../utils/tryFetch';

// export default function useFetch<T>(fetchFn: () => Promise<T>) {
export default function useFetch<T>(url: string, options?: RequestInit) {

    const [data, setData] = React.useState<T | undefined>(undefined);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<Error | null>(null);

    const fetchData = React.useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await tryFetch<T>(url, options);
            setData(data);
        } catch (error) {
            setError(error as Error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { data, isLoading, error, fetchData };


    //     const { data } = await tryFetch<{ data: { game: Game, gamePlayer: GamePlayer } }>(`http://localhost:3000/games`, { method: 'POST' });
    //     return data;

    //   return (

    //   )
}
