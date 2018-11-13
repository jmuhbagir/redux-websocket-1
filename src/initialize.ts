import { compose } from 'redux';
import { Config } from './config';
import close from './close';
import * as actions from './actions';
import { createConnection } from './websocket';

export default (dispatch: Function, config: Config) => {
  // Close connection first (if exists)
  close();

  // Instantiate the websocket.
  const websocket = createConnection(config);

  // Send connecting information
  dispatch(actions.connecting())

  // Setup handlers to be called like this:
  // dispatch(open(event));
  websocket.onopen = () => dispatch(actions.open);
  websocket.onclose = () => dispatch(actions.closed);
  websocket.onmessage = () => dispatch(actions.message);
};
