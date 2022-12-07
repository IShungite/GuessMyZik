export default async function call<T>(url: string, init?: RequestInit): Promise<T> {

    const headers = new Headers(init?.headers);
    const authValue = JSON.parse(localStorage.getItem('auth') || "null");
    headers.set('Authorization', `Bearer ${authValue && authValue.access_token}`);

    // automatically add json content type if body is present
    if (init && init.body) {
        headers.set('Content-Type', 'application/json')
    }

    //console.log(headers);
    const response = await fetch(url, { ...init, headers });
    //console.log(response);
    if (!response.ok) {
        throw new Error(`${response.status}, ${response.statusText}`);
    }
    const data = await response.json();
    return data;

}

