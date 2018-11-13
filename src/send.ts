import websocket from './websocket';

export default (message: any) => {
  if (websocket) {
    websocket.send(JSON.stringify(message));
  } else {
    console.warn('WebSocket is closed, ignoring. Trigger a WEBSOCKET_CONNECT first.');
  }
};
