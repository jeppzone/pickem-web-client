<script>
  import { toast } from "@zerodevx/svelte-toast";
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
    loading = true;
    const madeChoices = {};
    for (const key of Object.keys(choices)) {
      if (choices[key] !== -1 && !games.find((g) => g.id === key).isFinished) {
        madeChoices[key] = choices[key];
      }
    }
    await makeBets(madeChoices, $loggedInUser);
    loading = false;
    toast.push("Bets made");
  }

  async function setUpBets(games) {
    console.log("Setup bets");
    try {
      if (games && games.length > 0) {
        choices = {};
        existingBets = await fetchBets(games[0].season, games[0].seasonType, games[0].week, $loggedInUser);
        games.forEach((g) => {
          var matchingBet = existingBets.find((b) => b.game.id === g.id);
          choices[g.id] = matchingBet ? matchingBet.winningTeam.id : -1;
        });
      }
      console.log(existingBets);
    } catch (err) {
      toast.push("Could not fetch bets");
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

<div class="container">
  <h1>Make bets</h1>
  <SelectSeason on:season-select-started={handleSeasonSelectStarted} on:season-select-finished={handleSeasonSelectFinished} />
  {#if loading}
    <LoadingIndicator />
  {:else}
    <h2>
      {nbrOfSuccessfulBets(existingBets)}
      /
      {nbrOfFinishedBets(existingBets)}
      &nbsp|&nbsp
      {points(existingBets).toFixed(2)}
      points
    </h2>
    {#each games as game}
      <div
        class={game.isFinished && hasUserBetOnGame(game)
          ? isBetSuccessful(existingBets, game)
            ? "game-card success"
            : "game-card failure"
          : "game-card"}
      >
        <div class="team">
          <div class="team-name-and-logo">
            <span>
              <img src={game.awayTeam.logo} alt={game.awayTeam.name} />
            </span>
            <span> <b>{game.awayTeam.name}</b> </span>
          </div>
          <div class="odds">{game.awayTeamOdds || "N/A"}</div>
          <div class="input">
            <input
              type="radio"
              bind:group={choices[game.id]}
              value={game.awayTeam.id}
              disabled={game.isFinished || game.isOngoing || !game.awayTeamOdds}
            />
          </div>
          {#if game.isFinished}
            <div class={game?.awayTeam?.id === game?.winner?.id ? "winner" : "loser"}>
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
          <div class="odds">{game.homeTeamOdds || "N/A"}</div>
          <div class="input">
            <input
              type="radio"
              bind:group={choices[game.id]}
              value={game.homeTeam.id}
              disabled={game.isFinished || game.isOngoing || !game.homeTeamOdds}
            />
          </div>
          {#if game.isFinished}
            <div class={game?.homeTeam?.id === game?.winner?.id ? "winner" : "loser"}>
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

<style>
  .game-card {
    background-color: rgb(5, 47, 75);
    margin-bottom: 0.5em;
    width: 90%;
    padding: 8px;
    border-radius: 10px;
  }

  b {
    margin-bottom: 1vh;
    margin-top: 1vh;
  }

  .success {
    background-color: rgb(22, 98, 54);
  }

  .failure {
    background-color: rgb(88, 28, 35);
  }

  .game-card img {
    width: 30px;
  }

  .team {
    display: flex;
    align-items: center;
  }
  .team-name-and-logo b {
    padding: 0.5em;
  }
  .team-name-and-logo {
    display: flex;
    align-items: center;
    width: 300px;
  }
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    font-size: 18px;
  }
  .odds {
    display: flex;
    align-items: center;
    width: 80px;
  }

  .input {
    margin-top: 18px;
    width: 80px;
  }

  button {
    background-color: rgb(231, 117, 52);
    color: white;
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
  }

  input[type="radio"]:disabled:after {
    position: relative;
    content: "";
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #fff;
  }

  input[type="radio"]:disabled:checked:after {
    background-color: rgb(231, 117, 52);
  }
</style>