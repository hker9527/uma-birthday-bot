export const req2json = async (url: string) => {
    const response = await fetch(url);
    const json = await response.json();

    return json;
};