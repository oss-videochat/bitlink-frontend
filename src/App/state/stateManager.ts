import State, {defaults as _defaults} from "./globState";

interface Handler {
    name: string,
    callback: (state: State) => any
}

const globState: State = _defaults;

const watchers: Array<(state: State) => any> = [];
const eventHandlers: Handler[] = [];

function invokeHandlers() {
    for (const handler of watchers)
        handler(globState);
}

const setState = function (state?: ((state: State) => State) | State) {
    const _state = typeof state === "function" ? state(globState) : state;
    if (_state) {
        for (const i of Object.keys(_state))
            // @ts-ignore
            globState[i] = _state[i];

        invokeHandlers();
    }

    return globState
};

export default setState;

export function onStateChange(callback: (state: State) => any): number {
    watchers.push(callback);

    return watchers.length;
}

export function removeStateListener(id: number): void {
    if (watchers[id])
        delete watchers[id];
}

export function on(event: string, callback: (state: State) => any): number {
    eventHandlers.push({
        name: event,
        callback
    });

    return eventHandlers.length;
}

export function off(id: number): void {
    if (eventHandlers[id])
        delete eventHandlers[id];
}

export function dispatch(event: string, state: ((prev: State) => State) | State) {
    if (typeof state === "function")
        setState(state(globState));
    else
        setState(state);

    const events = eventHandlers.filter(i => i.name === event);

    for (const i of events)
        i.callback(globState);
}

export function broadcast(event: string) {
    const events = eventHandlers.filter(i => i.name === event);

    for (const i of events)
        i.callback(globState);
}

interface Utils { // Declare shape of utility functions here.

}

export const utils: Utils = {}; // Add functions that rely heavily on state as utility functions here.

export const defaults = _defaults;
