import { compose } from 'redux';
import { partial, partialRight } from 'lodash';
import { Config } from './config';
import close from './close';
import * as actions from './actions';
import { createConnection } from './websocket';

export default (dispatch: Function, config: Config) => {
  // Close connection first (if exists)
  close();

  // Instantiate the websocket.
  const websocket = createConnection(config);

  // Function will dispatch actions returned from action creators.
  const dispatchAction = partial(compose, [dispatch]);

  // Send connecting information
  dispatchAction(actions.connecting);

  // Setup handlers to be called like this:
  // dispatch(open(event));
  websocket.onopen = dispatchAction(actions.open);
  websocket.onclose = dispatchAction(actions.closed);
  websocket.onmessage = dispatchAction(actions.message);
};
