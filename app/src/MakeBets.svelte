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
    if (
      games.filter((g) => g.isBetable).length !==
      Object.keys(madeChoices).length
    ) {
      pushErrorToast("You need to bet on all betable games");
      return;
    }
    loading = true;
    try {
      await makeBets(madeChoices, $loggedInUser);
      loading = false;
      toast.push("Bets made");
    } catch (err) {
      loading = false;
      pushErrorToast("Something went wrong while placing bets");
    }
  }

  async function setUpBets(games) {
    try {
      if (games && games.length > 0) {
        choices = {};
        existingBets = await fetchBets(
          games[0].season,
          games[0].seasonType,
          games[0].week,
          $loggedInUser
        );
      }
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

  function isBetSuccessful(bets, game) {
    var existingBet = bets.find((b) => b.game.id === game.id);
    return existingBet ? existingBet.successful : false;
  }

  function getBetByGame(game, existingBets) {
    return existingBets.find((b) => b.game.id === game.id);
  }

  function hasUserBetOnGame(game, existingBets) {
    const existingBet = getBetByGame(game, existingBets);
    return existingBet ? true : false;
  }

  function isBetOnTeam(game, team, existingBets) {
    const bet = getBetByGame(game, existingBets);
    return bet?.winningTeam?.id === team.id;
  }

  function getGameCardClass(existingBets, game) {
    return game.isFinished && hasUserBetOnGame(game, existingBets)
      ? isBetSuccessful(existingBets, game)
        ? "game-card success"
        : "game-card failure"
      : "game-card";
  }

  function getPointsText(existingBets) {
    return `${nbrOfSuccessfulBets(existingBets)}/${nbrOfFinishedBets(
      existingBets
    )} | 
    ${points(existingBets).toFixed(2)} points`;
  }

  function displayDate(date) {
    return `${new Date(date).toLocaleDateString("sv-SE")} ${new Date(
      date
    ).toLocaleTimeString("sv-SE")}`;
  }

  function allBetsMade(games, existingBets) {
    return existingBets.length === games.length;
  }

  function pushErrorToast(message) {
    toast.push(message, {
      theme: {
        "--toastBackground": "#f54260",
        "--toastProgressBackground": "white",
      },
    });
  }
</script>

<div class="container">
  <h1>Make bets</h1>
  <SelectSeason
    on:season-select-started={handleSeasonSelectStarted}
    on:season-select-finished={handleSeasonSelectFinished}
  />
  {#if loading}
    <LoadingIndicator />
  {:else if games.length > 0}
    <h2>{getPointsText(existingBets)}</h2>
    {#if allBetsMade(games, existingBets)}
      <p>All bets made for this week</p>
    {/if}
    {#each games as game}
      <div class={getGameCardClass(existingBets, game)}>
        <div class="start-time">
          <i>{displayDate(game.startTime)}</i>
        </div>
        <div class="team">
          <div class="team-name-and-logo">
            <span>
              <img src={game.awayTeam.logo} alt={game.awayTeam.name} />
            </span>
            <span> <b>{game.awayTeam.name}</b> </span>
          </div>
          {#if game.isFinished}
            <div
              class={game?.awayTeam?.id === game?.winner?.id
                ? "winner"
                : "loser"}
            >
              {game.awayTeamScore}
            </div>
          {:else}
            <div class="not-finished-score">
              {game.awayTeamScore}
            </div>
          {/if}
          {#if !hasUserBetOnGame(game, existingBets) && game.isBetable}
            <div class="odds">{game.awayTeamOdds || "N/A"}</div>
            <div class="input">
              <input
                type="radio"
                bind:group={choices[game.id]}
                value={game.awayTeam.id}
              />
            </div>
          {:else if isBetOnTeam(game, game.awayTeam, existingBets)}
            <div>
              {game.awayTeam.abbreviation} <b>@</b>
              {getBetByGame(game, existingBets).game.awayTeamOdds}
            </div>
          {/if}
        </div>
        <div class="team">
          <div class="team-name-and-logo">
            <span>
              <img src={game.homeTeam.logo} alt={game.homeTeam.name} />
            </span>
            <span> <b>{game.homeTeam.name}</b> </span>
          </div>
          {#if game.isFinished}
            <div
              class={game?.homeTeam?.id === game?.winner?.id
                ? "winner"
                : "loser"}
            >
              {game.homeTeamScore}
            </div>
          {:else}
            <div class="not-finished-score">
              {game.homeTeamScore}
            </div>
          {/if}
          {#if !hasUserBetOnGame(game, existingBets) && game.isBetable}
            <div class="odds">{game.homeTeamOdds || "N/A"}</div>
            <div class="input">
              <input
                type="radio"
                bind:group={choices[game.id]}
                value={game.homeTeam.id}
              />
            </div>
          {:else if isBetOnTeam(game, game.homeTeam, existingBets)}
            <div>
              {game.homeTeam.abbreviation} <b>@</b>
              {getBetByGame(game, existingBets).game.homeTeamOdds}
            </div>
          {/if}
        </div>
      </div>
    {/each}
    {#if !allBetsMade(games, existingBets)}
      <button type="submit" on:click|preventDefault={submitBets}
        >Place bets</button
      >
    {/if}
  {:else}
    <h2>No games yet</h2>
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
    width: 100px;
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

  .not-finished-score {
    width: 4em;
  }

  .start-time {
    padding-bottom: 1vh;
    padding-left: 0.5vh;
  }

  @media only screen and (max-width: 600px) {
    .team-name-and-logo {
      width: 200px;
    }
    .not-finished-score,
    .winner,
    .loser {
      width: 1.5em;
    }
  }
</style>
