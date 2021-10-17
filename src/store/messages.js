import { createEvent, createStore } from 'effector';

const insertion = createEvent();
const addition = createEvent();
const replacement = createEvent();

const $messages = createStore(
    JSON.parse(localStorage.getItem('messages')) || []
)
    .on(addition, (state, message) => [...state, message])
    .on(insertion, (state, message) => {
        const index = state.findIndex((value) => value.id === message.id);
        return [...state.slice(0, index), message, ...state.slice(index + 1)];
    })
    .on(replacement, (state, newState) => [...newState]);

export { $messages, insertion, addition, replacement };