<script>
  import { loggedInUser } from "./auth.js";
  import { fetchBets, makeBets } from "./api";
  import SelectSeason from "./SelectSeason.svelte";
  import LoadingIndicator from "./LoadingIndicator.svelte";
  let loading = false;
  let games = [];
  let existingBets = [];
  let choices = {};

  function handleSeasonSelectFinished(evt) {
    games = evt.detail.games;
    console.log(games);
    setUpBets(games);
    loading = false;
  }

  function handleSeasonSelectStarted() {
    loading = true;
  }

  async function submitBets() {
    const madeChoices = {};
    for (const key of Object.keys(choices)) {
      if (choices[key] !== -1 && !games.find((g) => g.id === key).isFinished) {
        madeChoices[key] = choices[key];
      }
    }
    await makeBets(madeChoices, $loggedInUser);
  }

  async function setUpBets(games) {
    if (games && games.length > 0) {
      choices = {};
      existingBets = await fetchBets(
        games[0].season,
        games[0].seasonType,
        games[0].week,
        $loggedInUser
      );
      games.forEach((g) => {
        var matchingBet = existingBets.find((b) => b.game.id === g.id);
        choices[g.id] = matchingBet ? matchingBet.winningTeam.id : -1;
      });
    }
  }

  function nbrOfSuccessfulBets(bets) {
    return bets.filter((b) => b.successful).length;
  }

  function nbrOfFinishedBets(bets) {
    return bets.filter((b) => b.finished).length;
  }

  function points(bets) {
    return bets.reduce((x, y) => x + y.points, 0);
  }

  function pointsForGame(bets, game) {
    var existingBet = bets.find((b) => b.game.id === game.id);
    return existingBet ? existingBet.points : 0;
  }

  function isBetOnTeam(bets, game, team) {
    var existingBet = bets.find((b) => b.game.id === game.id);
    return existingBet ? existingBet.winningTeam.id === team.id : false;
  }

  function isBetSuccessful(bets, game) {
    var existingBet = bets.find((b) => b.game.id === game.id);
    return existingBet ? existingBet.successful : false;
  }

  function hasUserBetOnGame(game) {
    var existingBet = existingBets.find((b) => b.game.id === game.id);
    return existingBet ? true : false;
  }

</script>

<style>
  .game-card {
    background-color: #f0f3f3;
    margin-bottom: 1em;
    width: 90%;
  }

  .success {
    background-color:rgb(208 255 208);
  }

  .failure {
    background-color: rgb(241, 208, 212);
  }

  .game-card img {
    width: 30px;
  }

  .team {
    display: flex;
    align-items: center;
  }
  .team-name-and-logo b {
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
  .odds {
    display: flex;
    align-items: center;
    width: 4em;
  }

  .input {
    margin-top: 5px;
    width: 4em;
  }

  button {
    background-color: rgb(231, 117, 52);
    color: white;
    padding: 10px;
    cursor: pointer;
  }

  .winner {
    font-weight: bold;
    width: 4em;
  }

  .loser {
    opacity: 0.8;
    width: 4em;
  }

  input[type="radio"]:disabled {
    position: relative;
    height: 15px;
    width: 15px;
    box-sizing: border-box;
    margin: 0;
  }

  input[type="radio"]:disabled:checked:after {
    position: relative;
    content: "";
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: rgb(231, 117, 52);
  }
</style>

<div class="container">
  <h2>Make bets</h2>
  <SelectSeason
    on:season-select-started={handleSeasonSelectStarted}
    on:season-select-finished={handleSeasonSelectFinished} />
  {#if loading}
    <LoadingIndicator />
  {:else}
    <b>{nbrOfSuccessfulBets(existingBets)}
      /
      {nbrOfFinishedBets(existingBets)}
      for
      {points(existingBets).toFixed(2)}
      points</b>
    {#each games as game}
      <div class={game.isFinished && hasUserBetOnGame(game) ? (isBetSuccessful(existingBets, game) ? "game-card success" : "game-card failure") : "game-card"}>
        <div class="team">
          <div class="team-name-and-logo">
            <span>
              <img src={game.awayTeam.logo} alt={game.awayTeam.name} />
            </span>
            <span> <b>{game.awayTeam.name}</b> </span>
          </div>
          <div class="odds">{game.awayTeamOdds}</div>
          <div class="input">
            <input
              type="radio"
              bind:group={choices[game.id]}
              value={game.awayTeam.id}
              disabled={game.isFinished || game.isOngoing} />
          </div>
          {#if game.isFinished}
            <div
              class={game?.awayTeam?.id === game?.winner?.id ? 'winner' : 'loser'}>
              {game.awayTeamScore}
            </div>
            {#if isBetOnTeam(existingBets, game, game.awayTeam)}
              <b>{pointsForGame(existingBets, game)}&nbsp;</b>
              points
            {/if}
          {/if}
        </div>
        <div class="team">
          <div class="team-name-and-logo">
            <span>
              <img src={game.homeTeam.logo} alt={game.homeTeam.name} />
            </span>
            <span> <b>{game.homeTeam.name}</b> </span>
          </div>
          <div class="odds">{game.homeTeamOdds}</div>
          <div class="input">
            <input
              type="radio"
              bind:group={choices[game.id]}
              value={game.homeTeam.id}
              disabled={game.isFinished} />
          </div>
          {#if game.isFinished}
            <div
              class={game?.homeTeam?.id === game?.winner?.id ? 'winner' : 'loser'}>
              {game.homeTeamScore}
            </div>
            {#if isBetOnTeam(existingBets, game, game.homeTeam)}
              <b>{pointsForGame(existingBets, game)}&nbsp;</b>
              points
            {/if}
          {/if}
        </div>
      </div>
    {/each}
    <button type="submit" on:click|preventDefault={submitBets}>Place bets</button>
  {/if}
</div>
