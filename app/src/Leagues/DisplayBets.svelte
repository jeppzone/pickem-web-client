<script>
  import { onMount } from "svelte";
  import LoadingIndicator from "../LoadingIndicator.svelte";
  import { loggedInUser } from "../auth";
  import SelectSeason from "../SelectSeason.svelte";

  export let league;

  let sliceStartIndex = 0;
  let sliceEndIndex = 4;
  let loading = false;
  let allUsers = [];
  let selectedUsers = [];
  let games = [];

  onMount(async () => {
    allUsers = league.users;
    selectedUsers = Object.values(allUsers)
      .filter((u) => u.id !== $loggedInUser?.id)
      .slice(sliceStartIndex, sliceEndIndex);
  });

  function handleSeasonSelectFinished(evt) {
    games = evt.detail.games;
    loading = false;
  }

  function handleSeasonSelectStarted() {
    loading = true;
  }

  function getBetByUser(gameId, userId, league) {
    const userBets = league.bets[userId];
    if (!userBets) {
      return {};
    }
    return userBets?.find((b) => b.game.id === gameId);
  }

  function getCellClass(gameId, userId, league) {
    const bet = getBetByUser(gameId, userId, league);
    if (!bet?.finished) {
      return "";
    }
    return bet.successful ? "success" : "failure";
  }

  function nextBatch() {
    if (sliceEndIndex === nbrOfUsers(allUsers) + 1) {
      sliceStartIndex = 0;
      sliceEndIndex = 4;
    } else {
      sliceStartIndex = Math.min(sliceEndIndex, nbrOfUsers(allUsers) - 5);
      sliceEndIndex = Math.min(sliceEndIndex + 4, nbrOfUsers(allUsers) + 1);
    }
    selectedUsers = Object.values(allUsers)
      .filter((u) => u.id !== $loggedInUser?.id)
      .slice(sliceStartIndex, sliceEndIndex);
  }

  function nbrOfUsers(users) {
    return Object.keys(users).length;
  }

  function pointsForUser(userBets, week, seasonType) {
    return userBets.filter((b) => b.game.week === week && b.game.seasonType === seasonType).reduce((x, y) => x + y.points, 0);
  }

  function nbrOfSuccessfulBets(bets, week, seasonType) {
    return bets.filter((b) => b.game.week === week && b.game.seasonType === seasonType && b.successful).length;
  }

  function nbrOfFinishedBets(bets, week, seasonType) {
    return bets.filter((b) => b.game.week === week && b.game.seasonType === seasonType && b.finished).length;
  }

  function getPointsText(existingBets) {
    if (!existingBets) {
      return "";
    }
    const week = games[0].week;
    const seasonType = games[0].seasonType;
    return `${pointsForUser(existingBets, week, seasonType).toFixed(2)}`;
  }

  function getRecord(existingBets) {
    if (!existingBets) {
      return "";
    }
    const week = games[0].week;
    const seasonType = games[0].seasonType;
    return `${nbrOfSuccessfulBets(existingBets, week, seasonType)}-${
      nbrOfFinishedBets(existingBets, week, seasonType) - nbrOfSuccessfulBets(existingBets, week, seasonType)
    }`;
  }
</script>

<div class="container">
  <h2>View bets</h2>
  <SelectSeason on:season-select-started={handleSeasonSelectStarted} on:season-select-finished={handleSeasonSelectFinished} />
  {#if loading}
    <LoadingIndicator />
  {:else if games.length > 0}
    {#if nbrOfUsers(allUsers) >= 5}
      <button on:click={nextBatch}>Switch users</button>
    {/if}
    <table>
      <tr>
        <th class="game-heading">Game</th>
        <th class="my-cell">{$loggedInUser?.username}</th>
        {#each Object.values(selectedUsers) as user}
          <th>{user.username}</th>
        {/each}
      </tr>
      <tr>
        <td>Points</td>
        <td>{getPointsText(league.bets[$loggedInUser?.id])}<br />({getRecord(league.bets[$loggedInUser?.id])})</td>
        {#each Object.values(selectedUsers) as user}
          <td>{getPointsText(league.bets[user.id])}<br />({getRecord(league.bets[user.id])})</td>
        {/each}
      </tr>
      {#each games as game}
        <tr>
          <td class="asd">
            {game.awayTeam.abbreviation}
            <b>@</b>
            {game.homeTeam.abbreviation}
          </td>
          <td class={getCellClass(game.id, $loggedInUser?.id, league)}>
            <img
              src={getBetByUser(game.id, $loggedInUser?.id, league)?.winningTeam?.logo ?? "/assets/logo.png"}
              alt={getBetByUser(game.id, $loggedInUser?.id, league)?.winningTeam?.name ?? "No bet"}
            />
          </td>
          {#each Object.values(selectedUsers) as user}
            <td class={getCellClass(game.id, user.id, league)}>
              <img
                src={getBetByUser(game.id, user.id, league)?.winningTeam?.logo ?? "/assets/logo.png"}
                alt={getBetByUser(game.id, user.id, league)?.winningTeam?.name ?? "No bet"}
              />
            </td>
          {/each}
        </tr>
      {/each}
    </table>
  {:else}
    <h3>No games yet</h3>
  {/if}
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 100%;
  }

  .my-cell {
    border: 2px solid rgb(233, 147, 97);
  }

  .game-heading {
    padding-left: 3em;
    padding-right: 3em;
  }

  .success {
    background-color: rgb(22, 98, 54);
  }

  .failure {
    background-color: rgb(88, 28, 35);
  }

  table {
    width: 80%;
  }

  img {
    width: 40px;
  }

  table,
  th,
  td {
    border-radius: 5px;
  }
  th {
    padding: 1.5em;
    text-align: center;
  }
  td {
    padding: 1.5em;
    text-align: center;
  }
  tr:nth-child(odd) {
    background-color: rgb(12, 35, 49);
  }
  tr:nth-child(even) {
    background-color: rgb(12, 35, 49);
  }

  button {
    background-color: rgb(231, 117, 52);
    color: white;
    cursor: pointer;
    margin-top: 1em;
  }

  @media only screen and (max-width: 600px) {
    table {
      width: 100%;
    }
    th {
      padding: 1vw;
      text-align: center;
    }
    td {
      padding: 1vw;
      text-align: center;
    }
    .game-heading {
      padding-left: 0;
      padding-right: 0;
    }
  }
</style>
