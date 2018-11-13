import { Middleware } from 'redux';
import { isType } from 'typescript-fsa';
import {
  websocketConnectAction,
  websocketDisconnectAction,
  websocketSendAction,
} from './actions';
import initialize from './initialize';
import close from './close';
import send from './send';

export * from './actions';
export * from './Config';
export * from './ConnectOptions';
export * from './DisconnectOptions';

const createMiddleware = (): Middleware => store => next => action => {
  if (action && isType(action, websocketConnectAction)) initialize(store.dispatch, action.payload);
  else if (action && isType(action, websocketDisconnectAction)) close(action.payload);
  else if (action && isType(action, websocketSendAction)) send(action.payload);
  next(action);
};

export default createMiddleware();
