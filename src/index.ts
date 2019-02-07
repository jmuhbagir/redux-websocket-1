import { Middleware, Dispatch } from 'redux';
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

const createMiddleware = (): Middleware => {
  // Store WebSocket instance here
  let websocket: WebSocket;

  // Stored config
  let websocketConfig: ConnectOptions;

  function handleConnect(dispatch: Dispatch, options: ConnectOptions) {
    // Close connection first (if exists)
    if (websocket) handleClose({ notifyOnClose: false });

    // Instantiate the websocket.
    const { url, args, binaryType } = options;
    if (!url) throw new Error('Cannot create WebSocket instance: no URL set');
    websocket = new WebSocket(url, ...args);
    if (binaryType) websocket.binaryType = binaryType;

    // Store configuration
    websocketConfig = options;

    // Send connecting information
    dispatch(websocketConnectingAction());

    // Setup handlers to be called like this:
    // dispatch(open(event));
    websocket.onopen = event => dispatch(websocketOpenAction(event));
    websocket.onclose = event => dispatch(websocketClosedAction(event));
    websocket.onmessage = event => dispatch(websocketMessageAction(event));
  }

  function handleClose(options: DisconnectOptions) {
    const { notifyOnClose } = options;
    if (websocket && websocket.url) {
      if (!notifyOnClose) {
        websocket.onclose = null;
      }
      console.warn(`Closing WebSocket connection to ${websocket.url} ...`);
      websocket.close();
      websocket = null;
    }
  }

  function handleSend(message: any) {
    if (websocket) {
      websocket.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is closed, ignoring. Trigger a WEBSOCKET_CONNECT first.');
    }
  }

  let attempts = 1;
  function handleOpen() {
    attempts = 1;
  }

  const generateInterval = (k: number) => Math.min(30, (Math.pow(2, k) - 1)) * 1000;
  function handleClosed(dispatch: Dispatch) {
    if (!websocketConfig || !websocketConfig.autoReconnect) return;
    const time = generateInterval(attempts);
    const retryAttempt = () => {
      attempts += 1;
      handleConnect(dispatch, websocketConfig);
    };
    setTimeout(retryAttempt, time);
  }

  return store => next => action => {
    if (isType(action, websocketConnectAction)) handleConnect(store.dispatch, action.payload);
    else if (isType(action, websocketDisconnectAction)) handleClose(action.payload);
    else if (isType(action, websocketSendAction)) handleSend(action.payload);
    else if (isType(action, websocketOpenAction)) handleOpen();
    else if (isType(action, websocketClosedAction)) handleClosed(store.dispatch);
    next(action);
  };
};

export default createMiddleware();
