<script lang="ts">
  import { GameFacade, type GameKey } from "$lib/components/Game/GameFacade";
  import GameLoader from "./GameLoader.svelte";

  const gameUrls: Record<GameKey, string> = {
    "Flappy Package": "https://niravanaa.github.io/FlappyPackage/",
    "Package Clicker": "https://niravanaa.github.io/PackageClicker/",
    "Package Climber": "https://niravanaa.github.io/PackageClimber/",
  };

  const gameFacade = new GameFacade(gameUrls);
  let selectedGame: GameKey | null = null;

  // Update gameUrl reactively based on selectedGame
  $: gameUrl = selectedGame ? gameFacade.getGameUrl(selectedGame) : "";

  // Handle radio selection to update selectedGame and gameUrl instantly
  const onGameSelect = (gameKey: GameKey) => {
    selectedGame = gameKey;
  };
</script>

<div class="card flex flex-col items-center justify-center space-y-4 p-4">
  {#if gameUrl}
    <GameLoader bind:url={gameUrl} />
  {/if}

  <div class="flex space-x-4">
    {#each gameFacade.getAvailableGames() as gameKey}
      <label class="flex items-center space-x-2">
        <input
          class="radio"
          type="radio"
          bind:group={selectedGame}
          value={gameKey}
          on:change={() => onGameSelect(gameKey)} />
        <p>{gameKey}</p>
      </label>
    {/each}
  </div>
</div>
