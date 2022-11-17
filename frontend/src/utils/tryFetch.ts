export default async function tryFetch<T>(url: string, init?: RequestInit): Promise<T> {
  try {
    console.log(init);
    // automatically add json content type if body is present
    if (init && init.body) {
      init.headers = {
        'Content-Type': 'application/json',
        ...init.headers,
      };
    }

    const response = await fetch(url, init);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Error while fetching data");
  }
}
