export enum Queues {
  PLAYER = 'PLAYER',
  TURN_COUNTDOWN = 'TURN_COUNTDOWN',
}

export interface PlayerQueuePayload {
  connectedSocketId: string;
}

export interface TurnCountdownQueuePayload {
  gameId: string;
}
