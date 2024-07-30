export enum Colors {
  RED = 'RED',
  YELLOW = 'YELLOW',
}

export interface SerializedGame {
  id: string;
  turnCountdownJobId: string;
  player1: string;
  player2: string;
  playerTurn: string;
  colorTurn: Colors;
  grid: string;
}

export class Game {
  public id: string;
  public turnCountdownJobId: string;
  public player1: string;
  public player2: string;
  public playerTurn: string;
  public colorTurn: Colors;
  public grid: Array<Array<Colors | null>> = Array(7)
    .fill(null)
    .map(() => Array(6).fill(null));

  public serialize(): SerializedGame {
    return {
      ...this,
      grid: JSON.stringify(this.grid),
    };
  }

  public static deserialize(serializedGame: SerializedGame): Game {
    const game = new Game();
    game.id = serializedGame.id;
    game.turnCountdownJobId = serializedGame.turnCountdownJobId;
    game.player1 = serializedGame.player1;
    game.player2 = serializedGame.player2;
    game.playerTurn = serializedGame.playerTurn;
    game.colorTurn = serializedGame.colorTurn;
    game.grid = JSON.parse(serializedGame.grid);
    return game;
  }
}
