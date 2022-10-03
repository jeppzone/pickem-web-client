<script>
  import { toast } from "@zerodevx/svelte-toast";
  import { loggedInUser } from "./auth.js";
  import { fetchBets, makeBets } from "./api";
  import { groupByArray } from "./util";
  import SelectSeason from "./SelectSeason.svelte";
  import LoadingIndicator from "./LoadingIndicator.svelte";
  import Game from "./Game.svelte";
  let loading = false;
  let games = [];
  let existingBets = [];
  let choices = {};

  async function handleSeasonSelectFinished(evt) {
    games = evt.detail.games;
    groupGamesByDate(games);
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
      await setUpBets(games);
      toast.push("Bets made");
      loading = false;
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

  function getPointsText(existingBets) {
    return `${points(existingBets).toFixed(2)} points (${nbrOfSuccessfulBets(existingBets)}-${
      nbrOfFinishedBets(existingBets) - nbrOfSuccessfulBets(existingBets)
    }) 
    `;
  }

  function groupGamesByDate(games) {
    const gamesToShow = getGamesToShow(games);
    const result = groupByArray(gamesToShow, (g) => {
      return new Date(g.startTime).toDateString();
    });
    return result;
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

  function anyBetableGames(games) {
    return games.some((g) => g.isBetable);
  }

  function getGamesToShow(games) {
    const gamesToShow = games.filter((g) => g.isFinished || g.isOngoing || g.isBetable);
    if (gamesToShow.some((g) => g.isBetable)) {
      return gamesToShow;
    }

    return games;
  }
</script>

<div class="container">
  <div class="header">
    <h1>Make bets</h1>
    <SelectSeason on:season-select-started={handleSeasonSelectStarted} on:season-select-finished={handleSeasonSelectFinished} />
  </div>
  <div class="content">
    {#if loading}
      <LoadingIndicator />
    {:else if games.length > 0 && !games.some((g) => g.awayTeam.name === "TBD" || g.homeTeam.name === "TBD")}
      <h2>{getPointsText(existingBets)}</h2>
      {#each groupGamesByDate(games) as group}
        <div class="game-group">
          <h4>{group.key.toUpperCase()}</h4>
          <br />
          {#each group.values as game}
            <Game {choices} {existingBets} {game} />
          {/each}
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

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    font-size: 18px;
  }

  button {
    background-color: rgb(231, 117, 52);
    color: white;
    width: 100%;
  }

  .game-group h4 {
    margin-left: 5px;
    letter-spacing: 1px;
    margin-block-end: 0.5rem;
    font-weight: 900;
  }

  @media only screen and (max-width: 800px) {
    .content {
      width: 90%;
    }
  }
</style>
