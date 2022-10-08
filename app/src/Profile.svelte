<script>
  import { onMount } from "svelte";
  import { getProfile } from "./api";
  import { loggedInUser } from "./auth";
  import LoadingIndicator from "./LoadingIndicator.svelte";

  let profile = {};
  let loading = false;
  $: innerWidth = 0;
  onMount(async () => {
    loading = true;
    try {
      profile = await getProfile($loggedInUser);
      loading = false;
    } catch (err) {
      loading = false;
    }
  });

  function displayTeamName(width, team) {
    return width > 800 ? team.name : team.abbreviation;
  }
</script>

<svelte:window bind:innerWidth />

<div class="container">
  <h1>{$loggedInUser.username}</h1>
  {#if loading}
    <LoadingIndicator />
  {:else}
    <h3>All-time stats</h3>
    <table>
      <tr>
        <td>Record</td>
        <td>{profile.statistics?.nbrOfCorrectBets} - {profile.statistics?.nbrOfIncorrectBets}</td>
      </tr>
      <tr>
        <td>Most points in a single bet</td>
        <td>{profile.statistics?.mostPointsInASingleBet}</td>
      </tr>
      <tr>
        <td>Most points in a week</td>
        <td>{profile.statistics?.mostPointsInAWeek}</td>
      </tr>
    </table>
    {#if profile.statistics?.teamBetRecords}
      <h3>Team bet records (won-lost)</h3>
      {#each profile.statistics?.teamBetRecords as teamBetRecord}
        <table>
          <tr>
            <td class="team-and-logo">
              <img src={teamBetRecord.team.logo} alt={teamBetRecord.team.name} />
              {displayTeamName(innerWidth, teamBetRecord.team)}
            </td>
            <td>{teamBetRecord.nbrOfCorrectBets} - {teamBetRecord.nbrOfIncorrectBets}</td>
          </tr>
        </table>
      {/each}
    {/if}
  {/if}
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 90%;
    height: 100%;
    font-size: 18px;
  }

  .team-and-logo {
    display: flex;
    align-items: center;
  }

  table img {
    width: 30px;
    margin-right: 10px;
  }
  table,
  td {
    min-width: 230px;
    max-width: 230px;
  }
  td {
    border-radius: 5px;
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

  @media only screen and (max-width: 800px) {
    td {
      min-width: 130px;
      max-width: 130px;
    }
  }
</style>
