import { compose } from 'redux';
import { partial } from 'lodash';
import { Config } from './Config';
import close from './close';
import {
  websocketConnectingAction,
  websocketOpenAction,
  websocketClosedAction,
  websocketMessageAction,
} from './actions';
import { createConnection } from './websocket';

export default (dispatch: Function, config: Config) => {
  // Close connection first (if exists)
  close();

  // Instantiate the websocket.
  const websocket = createConnection(config);

  // Send connecting information
  dispatch(websocketConnectingAction());

  // Function will dispatch actions returned from action creators.
  const dispatchAction = partial(compose, [dispatch]);

  // Setup handlers to be called like this:
  // dispatch(open(event));
  websocket.onopen = dispatchAction(websocketOpenAction);
  websocket.onclose = dispatchAction(websocketClosedAction);
  websocket.onmessage = dispatchAction(websocketMessageAction);
};
