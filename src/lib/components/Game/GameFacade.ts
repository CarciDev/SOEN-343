export type GameKey = "Flappy Package" | "Package Clicker" | "Package Climber";

export class GameFacade {
  private gameUrls: Record<GameKey, string>;

  constructor(gameUrls: Record<GameKey, string>) {
    this.gameUrls = gameUrls;
  }

  getGameUrl(gameKey: GameKey): string {
    return this.gameUrls[gameKey] || "";
  }

  getAvailableGames(): GameKey[] {
    return Object.keys(this.gameUrls) as GameKey[];
  }
}
