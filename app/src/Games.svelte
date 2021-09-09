<script>
  import { onMount } from "svelte";
  import LoadingIndicator from "./LoadingIndicator.svelte";
  import { fetchGamesForCurrentWeek } from "./api";
  let games = [];
  let loading = false;

  onMount(async () => {
    games = await fetchGamesForCurrentWeek();
    games = games.sort((a, b) => {
      return new Date(a.startTime) - new Date(b.startTime);
    });
  });
</script>

<div class="container">
  <h2>Recent / upcoming games</h2>
  {#if loading}
    <LoadingIndicator />
  {:else}
    {#each games as game}
      <div class="game-card">
        <div class="start-time">
          <i>
            {`${new Date(game.startTime).toLocaleDateString(
              "sv-SE"
            )} ${new Date(game.startTime).toLocaleTimeString("sv-SE")}`}
          </i>
        </div>
        <div class="team">
          <div class="team-name-and-logo">
            <span>
              <img src={game.awayTeam.logo} alt={game.awayTeam.name} />
            </span>
            <span> <b>{game.awayTeam.name}</b> </span>
          </div>
          <div class="score"><i>{game.awayTeamScore}</i></div>
        </div>
        <div class="team">
          <div class="team-name-and-logo">
            <span>
              <img src={game.homeTeam.logo} alt={game.homeTeam.name} />
            </span>
            <span> <b>{game.homeTeam.name}</b> </span>
          </div>
          <div class="score"><i>{game.homeTeamScore}</i></div>
        </div>
      </div>
    {/each}
  {/if}
</div>

<style>
  .game-card {
    background-color: rgb(5, 47, 75);
    margin-bottom: 1em;
    width: 90%;
    padding: 8px;
    border-radius: 5px;
  }

  .game-card img {
    width: 30px;
  }

  .team {
    display: flex;
    align-items: center;
  }
  .team b {
    padding: 1em;
  }
  .team-name-and-logo {
    display: flex;
    align-items: center;
    width: 250px;
  }
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    font-size: 18px;
  }

  .start-time {
    padding-bottom: 1vh;
    padding-left: 0.5vh;
  }
</style>
