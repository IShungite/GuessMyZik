import React from 'react'
import call from '../utils/call';

// export default function useFetch<T>(fetchFn: () => Promise<T>) {
export default function useFetch<T>() {

    const [data, setData] = React.useState<T | undefined>(undefined);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<Error | null>(null);

    const fetchData = React.useCallback(async (url: string, options?: RequestInit) => {
        setIsLoading(true);
        try {
            const data = await call<T>(url, options);
            setData(data);
        } catch (error) {
            console.warn(error);
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
