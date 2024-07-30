import { Game } from '../types/game.type';

export interface GameStartedMessage {
  gameToken: string;
  game: Game;
}
