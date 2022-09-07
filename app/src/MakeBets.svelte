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
  $: innerWidth = 0;

  async function handleSeasonSelectFinished(evt) {
    games = evt.detail.games;
    await setUpBets(games);
    loading = false;
  }

  function handleSeasonSelectStarted() {
    loading = true;
  }

  async function submitBets() {
    const madeChoices = {};
    for (const key of Object.keys(choices)) {
      if (choices[key] !== -1) {
        madeChoices[key] = choices[key];
      }
    }
    if (games.filter((g) => g.isBetable).length !== Object.keys(madeChoices).length) {
      pushErrorToast("You need to bet on all betable games");
      return;
    }
    loading = true;
    try {
      await makeBets(madeChoices, $loggedInUser);
      loading = false;
      toast.push("Bets made");
      setUpBets(games);
    } catch (err) {
      loading = false;
      pushErrorToast("Something went wrong while placing bets");
    }
  }

  async function setUpBets(games) {
    try {
      if (games && games.length > 0) {
        choices = {};
        existingBets = await fetchBets(games[0].season, games[0].seasonType, games[0].week, $loggedInUser);
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
    return `${points(existingBets).toFixed(2)} points (${nbrOfSuccessfulBets(existingBets)}-${
      nbrOfFinishedBets(existingBets) - nbrOfSuccessfulBets(existingBets)
    }) 
    `;
  }

  function displayDate(date) {
    return `${new Date(date).toLocaleDateString("sv-SE")} ${new Date(date).toLocaleTimeString("sv-SE")}`;
  }

  function allBetsMade(games, existingBets) {
    return existingBets.length === games.filter((g) => g.isBetable).length;
  }

  function pushErrorToast(message) {
    toast.push(message, {
      theme: {
        "--toastBackground": "#f54260",
        "--toastProgressBackground": "white",
      },
    });
  }

  function displayScore(game, score) {
    if (game.isFinished || game.isOngoing) {
      return score;
    }

    return "";
  }

  function displayTeamName(width, team) {
    return width > 800 ? team.name : team.abbreviation;
  }

  function anyBetableGames(games) {
    return games.some((g) => g.isBetable);
  }

  function anyFinishedGames(games) {
    return games.some((g) => g.isFinished);
  }

  function getGamesToShow(games) {
    const gamesToShow = games.filter((g) => g.isFinished || g.isOngoing || g.isBetable);
    if (gamesToShow.some((g) => g.isBetable)) {
      return gamesToShow;
    }

    return games;
  }
</script>

<svelte:window bind:innerWidth />

<div class="container">
  <div class="header">
    {#if !loading}
      <h1>Make bets</h1>
    {/if}
    <SelectSeason on:season-select-started={handleSeasonSelectStarted} on:season-select-finished={handleSeasonSelectFinished} />
  </div>
  <div class="content">
    {#if loading}
      <LoadingIndicator />
    {:else if games.length > 0 && !games.some((g) => g.awayTeam.name === "TBD" || g.homeTeam.name === "TBD")}
      <h2>{getPointsText(existingBets)}</h2>
      {#each getGamesToShow(games) as game}
        <div class={getGameCardClass(existingBets, game)}>
          <div class="start-time">
            <i>{displayDate(game.startTime)}</i>
          </div>
          <div class="team">
            <div class="team-name-and-logo">
              <span>
                <img src={game.awayTeam.logo} alt={game.awayTeam.name} />
              </span>
              <span class="team-name">
                <b>{displayTeamName(innerWidth, game.awayTeam)}</b>
              </span>
              {#if !game.isFinished && !game.isOngoing && game.awayTeam.record}
                <span class="record">
                  ({game.awayTeam.record})
                </span>
              {/if}
            </div>
            {#if game.isFinished}
              <div class={game?.awayTeam?.id === game?.winner?.id ? "winner" : "loser"}>
                {game.awayTeamScore}
              </div>
            {:else}
              <div class="not-finished-score">
                <i>{displayScore(game, game.awayTeamScore)}</i>
              </div>
            {/if}
            {#if !hasUserBetOnGame(game, existingBets) && game.isBetable}
              <div class="odds">{game.awayTeamOdds || "N/A"}</div>
              <div class="input">
                <input type="radio" bind:group={choices[game.id]} value={game.awayTeam.id} />
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
              <span class="team-name">
                <b>{displayTeamName(innerWidth, game.homeTeam)}</b>
              </span>
              {#if !game.isFinished && !game.isOngoing && game.homeTeam.record}
                <span class="record">
                  ({game.homeTeam.record})
                </span>
              {/if}
            </div>
            {#if game.isFinished}
              <div class={game?.homeTeam?.id === game?.winner?.id ? "winner" : "loser"}>
                {game.homeTeamScore}
              </div>
            {:else}
              <div class="not-finished-score">
                <i>{displayScore(game, game.homeTeamScore)}</i>
              </div>
            {/if}
            {#if !hasUserBetOnGame(game, existingBets) && game.isBetable}
              <div class="odds">{game.homeTeamOdds || "N/A"}</div>
              <div class="input">
                <input type="radio" bind:group={choices[game.id]} value={game.homeTeam.id} />
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
    {:else}
      <h2>No games yet</h2>
    {/if}
    <div>
      {#if !allBetsMade(games, existingBets) && anyBetableGames(games) && !loading}
        <button type="submit" on:click|preventDefault={submitBets}>Place bets</button>
      {/if}
    </div>
  </div>
</div>

<style>
  .header {
    width: 80%;
    max-width: 1000px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .content {
    width: 80%;
    max-width: 1000px;
  }
  .content h2 {
    text-align: center;
  }
  .game-card {
    background-color: rgb(5, 47, 75);
    margin-bottom: 0.5em;
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
  .team-name {
    width: 210px;
  }
  .record {
    width: 50px;
  }
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    font-size: 18px;
  }
  .odds {
    display: flex;
    align-items: center;
    width: 150px;
  }

  .input {
    margin-top: 18px;
    width: 100%;
  }

  button {
    background-color: rgb(231, 117, 52);
    color: white;
    width: 100%;
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

  @media only screen and (max-width: 800px) {
    .content {
      width: 90%;
    }
    .team-name-and-logo {
      width: 150px;
    }
    .team-name {
      width: 50px;
    }
    .not-finished-score,
    .winner,
    .loser {
      width: 1.5em;
    }
  }
</style>
