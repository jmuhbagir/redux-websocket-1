import { Config } from './config';

let websocket: WebSocket;
export function createConnection(config: Config) {
  if (config) {
    const { url, args, binaryType } = config;
    if (!url) throw new Error('Cannot create WebSocket instance: no URL set');
    websocket = new WebSocket(url, ...args);
    if (binaryType) websocket.binaryType = binaryType;
    return websocket;
  }
}

export function closeConnection() {
  websocket.close();
  websocket = null;
}

function getInstance() {
  return websocket;
}

export default getInstance();
