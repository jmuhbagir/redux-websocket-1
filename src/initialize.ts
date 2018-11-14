import { compose } from 'redux';
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

  // Setup handlers to be called like this:
  // dispatch(open(event));
  websocket.onopen = event => dispatch(websocketOpenAction(event));
  websocket.onclose = event => dispatch(websocketClosedAction(event));
  websocket.onmessage = event => dispatch(websocketMessageAction(event));
};
