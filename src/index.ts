import { Middleware } from 'redux';
import { isType } from 'typescript-fsa';
import * as actions from './actions';
import initialize from './initialize';
import close from './close';
import send from './send';

export * from './actions';
export * from './config';

const createMiddleware = (): Middleware => store => next => action => {
  if (isType(action, actions.connect)) initialize(store.dispatch, action.payload);
  else if (isType(action, actions.disconnect)) close(action.payload);
  else if (isType(action, actions.send)) send(action.payload);
  next(action);
};

export default createMiddleware();
