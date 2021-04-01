<script>
  import LoadingIndicator from "./LoadingIndicator.svelte";
  import SelectSeason from "./SelectSeason.svelte";
  let games = [];
  let loading = false;

  function handleSeasonSelectFinished(evt) {
    games = evt.detail.games;
    loading = false;
  }

  function handleSeasonSelectStarted(evt) {
    loading = true;
  }
</script>

<div class="container">
  <h2>Games</h2>
  <SelectSeason on:season-select-started={handleSeasonSelectStarted} on:season-select-finished={handleSeasonSelectFinished} />

  {#if loading}
    <LoadingIndicator />
  {:else}
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
  {/if}
</div>

<style>
  .game-card {
    background-color: rgb(0, 18, 29);
    margin-bottom: 1em;
    width: 90%;
    padding: 0.5em;
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

    -webkit-animation: fadein 0.5s; /* Safari, Chrome and Opera > 12.1 */
    -moz-animation: fadein 0.5s; /* Firefox < 16 */
    -ms-animation: fadein 0.5s; /* Internet Explorer */
    -o-animation: fadein 0.5s; /* Opera < 12.1 */
    animation: fadein 0.5s;
  }
</style>
