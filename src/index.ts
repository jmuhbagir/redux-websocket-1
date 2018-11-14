import { Middleware } from 'redux';
import { isType } from 'typescript-fsa';
import {
  websocketClosedAction,
  websocketConnectAction,
  websocketConnectingAction,
  websocketDisconnectAction,
  websocketMessageAction,
  websocketOpenAction,
  websocketSendAction,
} from './actions';
import { ConnectOptions } from './ConnectOptions';
import { DisconnectOptions } from './DisconnectOptions';

export * from './actions';
export * from './ConnectOptions';
export * from './DisconnectOptions';

const createMiddleware = (): Middleware => store => next => action => {
  // Store WebSocket instance here
  let websocket: WebSocket;

  function initialize(options: ConnectOptions) {
    // Close connection first (if exists)
    if (websocket) close({ notifyOnClose: false });

    // Instantiate the websocket.
    const { url, args, binaryType } = options;
    if (!url) throw new Error('Cannot create WebSocket instance: no URL set');
    websocket = new WebSocket(url, ...args);
    if (binaryType) websocket.binaryType = binaryType;

    // Send connecting information
    store.dispatch(websocketConnectingAction());

    // Setup handlers to be called like this:
    // dispatch(open(event));
    websocket.onopen = event => store.dispatch(websocketOpenAction(event));
    websocket.onclose = event => store.dispatch(websocketClosedAction(event));
    websocket.onmessage = event => store.dispatch(websocketMessageAction(event));
  }

  function close(options: DisconnectOptions) {
    const { notifyOnClose } = options;
    if (websocket) {
      if (!notifyOnClose) {
        websocket.onclose = null;
      }
      console.warn(`Closing WebSocket connection to ${websocket.url} ...`);
      websocket.close();
      websocket = null;
    }
  }

  function send(message: any) {
    if (websocket) {
      websocket.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is closed, ignoring. Trigger a WEBSOCKET_CONNECT first.');
    }
  }

  if (action && isType(action, websocketConnectAction)) initialize(action.payload);
  else if (action && isType(action, websocketDisconnectAction)) close(action.payload);
  else if (action && isType(action, websocketSendAction)) send(action.payload);
  next(action);
};

export default createMiddleware();
