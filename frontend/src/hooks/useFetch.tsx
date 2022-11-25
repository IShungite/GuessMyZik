import React from 'react'
import call from '../utils/call';

// export default function useFetch<T>(fetchFn: () => Promise<T>) {
export default function useFetch<T>() {

    const [data, setData] = React.useState<T | undefined>(undefined);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<Error | null>(null);

    const fetchData = React.useCallback(async (url: string, options?: RequestInit): Promise<T | undefined> => {
        setIsLoading(true);
        try {
            const data = await call<T>(url, options);
            setData(data);
            return data;
        } catch (error) {
            console.warn(error);
            setError(error as Error);
        } finally {
            setIsLoading(false);
        }
        return undefined;
    }, []);

    return { data, isLoading, error, fetchData };
}
