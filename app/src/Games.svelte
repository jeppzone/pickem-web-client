<script>
  import { onMount } from "svelte";
  import { fetchGames } from "./api";
  let games = [];

  onMount(async () => {
    games = await fetchGames(17);
    games = games.sort((a, b) => {
      if (a.startTime > b.startTime) return 1;
      if (a.startTime < b.startTime) return -1;
      if (a.startTime == b.startTime) return 0;
    });
    console.log(games);
  });
</script>

<style>
  .game-card {
    background-color: #e9f4f5;
    margin-bottom: 1em;
    width: 90%;
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
  }
</style>

<div class="container">
  <h2>Games</h2>
  {#each games as game}
    <div class="game-card">
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
</div>
