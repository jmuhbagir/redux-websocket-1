import websocket, { closeConnection } from './websocket';
import { DisconnectOptions } from './DisconnectOptions';

export default ({ notifyOnClose = true }: DisconnectOptions = {}) => {
  if (websocket) {
    if (!notifyOnClose) {
      websocket.onclose = null;
    }
    console.warn(`Closing WebSocket connection to ${websocket.url} ...`);
    closeConnection();
  }
};
