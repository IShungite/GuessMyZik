export default async function tryFetch<T>(url: string, init?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, init);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw new Error('Error while fetching data');
  }
}
