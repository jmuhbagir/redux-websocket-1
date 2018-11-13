import websocket, { closeConnection } from './websocket';

export default (notifyOnClose: boolean = true) => {
  if (websocket) {
    if (!notifyOnClose) {
      websocket.onclose = null;
    }
    console.warn(`Closing WebSocket connection to ${websocket.url} ...`);
    closeConnection();
  }
};
