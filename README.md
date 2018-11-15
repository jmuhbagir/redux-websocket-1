# redux-websocket

## Summary

A Redux middleware for managing data over a WebSocket connection.

This middleware uses actions, dispatched with Redux to interact with a WebSocket server including connect, disconnect, message sending, and message receiving. All actions follow the [Flux Standard Action](https://github.com/acdlite/flux-standard-action) model, using `typescript-fsa` action creator.

This project is based on similar architecture as [@giantmachines/redux-websocket](https://github.com/giantmachines/redux-websocket).

## Installation

```bash
$ npm install @jussikinnula/redux-websocket --save
```

## Middleware Installation

Once you have installed the library via npm, you can add it to your Redux middleware stack just like you would any other middleware.

```javascript
// ... other imports
import websocket from '@jussikinnula/redux-websocket'

const app = combineReducers(reducers)
const store = createStore(
  app,
  applyMiddleware(
    websocket,
    ...
  )
)
```

## Usage

### Middleware dispatched actions

- `websocketConnectingAction` action is dispatched by the middleware, when WebSocket connection is initialized
- `websocketOpenAction` action is dispatched by the middleware, when WebSocket connection is opened
- `websocketCloseAction` action is dispatched by the middleware when WebSocket connection closes
- `websocketMessageAction` action is dispathed by the middleware when there's an incoming message

You can create a reducer to act accordingly when these actions are dispatched:

```typescript
import { Action } from 'redux';
import { isType } from 'typescript-fsa';
import {
  websocketConnectingAction,
  websocketOpenAction,
  websocketMessageAction,
  websocketCloseAction,
} from '@jussikinnula/redux-websocket';

interface State {
  connected: boolean;
  connecting: boolean;
  messages: string[];
}

const initialState: State = {
  connected: false,
  connecting: false,
  messages: [],
};

const reducer = (state: State = initialState, action: Action): State => {
  if (isType(action, websocketConnectingAction)) {
    return { ...state, connected: false, connecting: true };
  }
  if (isType(action, websocketOpenAction)) {
    return { ...state, connected: true, connecting: false };
  }
  if (isType(action, websocketMessageAction)) {
    const messages = state.messages.concat(message);
    return { ...state, messages };
  }
  if (isType(action, websocketCloseAction)) {
    return initialState;
  }
  return state;
}
```

Alternatively you can use `typescript-fsa-reducers` to implement reducers:

```typescript
import { Action } from 'redux';
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import {
  websocketConnectingAction,
  websocketOpenAction,
  websocketMessageAction,
  websocketCloseAction,
} from '@jussikinnula/redux-websocket';

interface State {
  connected: boolean;
  connecting: boolean;
  messages: string[];
}

const initialState: State = {
  connected: false,
  connecting: false,
  messages: [],
};

const reducer = reducerWithInitialState(initialState)
  .case(websocketConnectingAction, state => ({ ...state, connected: false, connecting: true }))
  .case(websocketOpenAction, state => ({ ...state, connected: true, connecting: false }))
  .case(websocketMessageAction, (state, payload) => ({ ...state, messages: [...state.messages, message] }))
  .case(websocketCloseAction, () => initialState);
```

### User dispatched actions

While the actions described above were dispatched by the middleware, you can dispatch the following actions to initialize connection, send a message and disconnect:

```typescript
import {
  websocketConnectAction,
  websocketSendAction,
  websocketDisconnectAction,
} from '@jussikinnula/redux-websocket';

// Start connection
store.dispatch(websocketConnectAction({
  url: 'ws://localhost:1234', // required, url: string
  binaryType: 'arraybuffer', // default = 'blob', binaryType: 'blob' | 'arraybuffer'
  autoReconnect: true, // default = false, autoReconnect: boolean
}));

// Send message
store.dispatch(websocketSendAction('Hello World!'));

// Close connection
store.dispatch(websocketDisconnectAction());
```
