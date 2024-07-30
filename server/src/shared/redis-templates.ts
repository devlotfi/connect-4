export class RedisTemplates {
  public static GAME(id: string) {
    return `GAME:${id}`;
  }

  public static PLAYER_GAME(id: string) {
    return `PLAYER_GAME:${id}`;
  }
}
