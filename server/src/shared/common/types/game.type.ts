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

  public checkForWin(): boolean {
    const cols = this.grid.length;
    const rows = this.grid[0].length;

    // Check horizontal win
    for (let col = 0; col < cols; col++) {
      for (let row = 0; row <= rows - 4; row++) {
        if (
          this.grid[col][row] &&
          this.grid[col][row] === this.grid[col][row + 1] &&
          this.grid[col][row] === this.grid[col][row + 2] &&
          this.grid[col][row] === this.grid[col][row + 3]
        ) {
          return true;
        }
      }
    }

    // Check vertical win
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col <= cols - 4; col++) {
        if (
          this.grid[col][row] &&
          this.grid[col][row] === this.grid[col + 1][row] &&
          this.grid[col][row] === this.grid[col + 2][row] &&
          this.grid[col][row] === this.grid[col + 3][row]
        ) {
          return true;
        }
      }
    }

    // Check diagonal (bottom-left to top-right) win
    for (let col = 3; col < cols; col++) {
      for (let row = 0; row <= rows - 4; row++) {
        if (
          this.grid[col][row] &&
          this.grid[col][row] === this.grid[col - 1][row + 1] &&
          this.grid[col][row] === this.grid[col - 2][row + 2] &&
          this.grid[col][row] === this.grid[col - 3][row + 3]
        ) {
          return true;
        }
      }
    }

    // Check diagonal (top-left to bottom-right) win
    for (let col = 0; col <= cols - 4; col++) {
      for (let row = 0; row <= rows - 4; row++) {
        if (
          this.grid[col][row] &&
          this.grid[col][row] === this.grid[col + 1][row + 1] &&
          this.grid[col][row] === this.grid[col + 2][row + 2] &&
          this.grid[col][row] === this.grid[col + 3][row + 3]
        ) {
          return true;
        }
      }
    }

    return false;
  }
}
