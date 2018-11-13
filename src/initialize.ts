import { compose } from 'redux';
import { Config } from './config';
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
  websocket.onopen = () => dispatch(websocketOpenAction);
  websocket.onclose = () => dispatch(websocketClosedAction);
  websocket.onmessage = () => dispatch(websocketMessageAction);
};
