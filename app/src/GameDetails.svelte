<script>
  import { onMount } from "svelte";
  import { anyEmptyNestedRoutes } from "svelte-router-spa/src/lib/utils";
  import { fetchGame } from "./api";
  import LoadingIndicator from "./LoadingIndicator.svelte";
  export let game;
  export let currentRoute;
  let loading = false;

  onMount(async () => {
    loading = true;
    if (!game) {
      const gameId = currentRoute.namedParams.id;
      console.log(gameId);
      game = await fetchGame(gameId);
      console.log(game);
    }
    loading = false;
  });
</script>

{#if loading}
  <LoadingIndicator />
{/if}
{#if game}
  <div class="container">
    <div class="content">
      <h2>{game.awayTeam.name} @ {game.homeTeam.name}</h2>
      <h3>{game.awayTeamScore} - {game.homeTeamScore}</h3>
    </div>
  </div>
{/if}

<style>
  .content {
    width: 80%;
    max-width: 1000px;
  }
  .content h2,
  h3 {
    text-align: center;
  }

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    font-size: 18px;
  }
</style>
