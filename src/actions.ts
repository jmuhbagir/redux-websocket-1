import actionCreatorFactory from 'typescript-fsa';
import { Config } from './config';

const actionCreator = actionCreatorFactory();

export const websocketConnectingAction = actionCreator<void>('WEBSOCKET_CONNECTING');

export const websocketOpenAction = actionCreator<Event>('WEBSOCKET_OPEN');

export const websocketClosedAction = actionCreator<Event>('WEBSOCKET_CLOSED');

export const websocketMessageAction = actionCreator<MessageEvent>('WEBSOCKET_MESSAGE');

export const websocketConnectAction = actionCreator<Config>('WEBSOCKET_CONNECT');

export const websocketDisconnectAction = actionCreator<boolean | undefined>('WEBSOCKET_DISCONNECT');

export const websocketSendAction = actionCreator<any>('WEBSOCKET_SEND');
