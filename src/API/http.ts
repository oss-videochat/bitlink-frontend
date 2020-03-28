export enum Method {
    get,
    post,
    put,
    delete,
    patch,
    head,
}

export default async function http<ReturnType = string>(url: string, method: Method = Method.get, body?: any): Promise<ReturnType> {
    let request: Response;

    if (method !== Method.get && method !== Method.head)
        request = await fetch(url, {
            method: Method[method].toUpperCase(),
            body: typeof body === 'object' ? JSON.stringify(body) : body
        });
    else
        request = await fetch(url, {
            method: Method[method].toUpperCase()
        });

    return await request.json() as ReturnType;
}