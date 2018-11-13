import { Config } from './config';

let storedConfig: Config;
let websocket: WebSocket;
export function createConnection(config: Config = storedConfig) {
  if (config) {
    const { url, args, binaryType } = config;
    if (!url) throw new Error('Cannot create WebSocket instance: no URL set');
    websocket = new WebSocket(url, ...args);
    storedConfig = config;
    if (binaryType) websocket.binaryType = binaryType;
    return websocket;
  }
}

export function closeConnection() {
  websocket.close();
  websocket = null;
}

function getInstance() {
  if (!websocket) {
    return createConnection();
  }
  return websocket;
}

export default getInstance();
