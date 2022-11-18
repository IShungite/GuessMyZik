export default async function call<T>(url: string, init?: RequestInit): Promise<T> {

    console.log(init);
    // automatically add json content type if body is present
    if (init && init.body) {
        init.headers = {
            'Content-Type': 'application/json',
            ...init.headers,
        };
    }

    const response = await fetch(url, init);
    if (!response.ok) {
        throw new Error(`${response.status}, ${response.statusText}`);
    }
    const data = await response.json();
    return data;

}

