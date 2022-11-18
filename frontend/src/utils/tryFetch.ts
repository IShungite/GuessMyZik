import call from "./call";

export default async function tryFetch<T>(url: string, init?: RequestInit): Promise<T> {
  try {
    return await call<T>(url, init);
  } catch (error) {
    console.log(error);
    throw new Error("Error while fetching data");
  }
}
