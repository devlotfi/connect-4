import { Game } from '../types/game.type';

export interface GameStartedMessage {
  accessToken: string;
  game: Game;
}
