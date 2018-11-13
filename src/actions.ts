import actionCreatorFactory from 'typescript-fsa';
import { Config } from './config';

const actionCreator = actionCreatorFactory();

export const connecting = actionCreator<void>('WEBSOCKET_CONNECTING');

export const open = actionCreator<Event>('WEBSOCKET_OPEN');

export const closed = actionCreator<Event>('WEBSOCKET_CLOSED');

export const message = actionCreator<MessageEvent>('WEBSOCKET_MESSAGE');

export const connect = actionCreator<Config>('WEBSOCKET_CONNECT');

export const disconnect = actionCreator<boolean>('WEBSOCKET_DISCONNECT');

export const send = actionCreator<any>('WEBSOCKET_SEND');
