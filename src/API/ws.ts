let messageId: number = 0;

export default function ws<SocketResponse>(message: any): Promise<SocketResponse> {
    return new Promise<SocketResponse>(async function (resolve: Function, reject: Function) {
        if (message)
            try {
                // Optional Data Validation

                // check if websocket connection is open.
                //  - if not, await the open event

                // Send `message` over websocket
                // wait for message from server with same ID
                // Resolve promise
            } catch (err) {
                reject(err);
            } finally {
                messageId++
            }
        else
            reject(null);
    });
}