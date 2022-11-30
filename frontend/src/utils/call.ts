export default async function call<T>(url: string, init?: RequestInit): Promise<T> {

    // automatically add json content type if body is present
    if (init && init.body) {
        const authValue = JSON.parse(localStorage.getItem('auth') || "null");
        init.headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authValue && authValue.access_token}`,
            ...init.headers,
        };
    }

    const response = await fetch(url, init);
    console.log(response);
    if (!response.ok) {
        throw new Error(`${response.status}, ${response.statusText}`);
    }
    const data = await response.json();
    return data;

}

