<script>
  import { onMount } from "svelte";
  import { getStatistics } from "./api";
  import { loggedInUser } from "./auth";
  import LoadingIndicator from "./LoadingIndicator.svelte";

  let statistics = [];
  let regularSeasonStatistics = [];
  let postSeasonStatistics = [];
  let seasons = [2022, 2021];
  let season = 2022;
  let loading = false;

  onMount(async () => {
    loading = true;
    statistics = await getStatistics($loggedInUser, season);
    regularSeasonStatistics = statistics?.filter((s) => s.seasonType === "Reg");
    postSeasonStatistics = statistics?.filter((s) => s.seasonType === "Post");
    loading = false;
  });

  async function fetchStatistics() {
    loading = true;
    statistics = await getStatistics($loggedInUser, season);
    regularSeasonStatistics = statistics?.filter((s) => s.seasonType === "Reg");
    postSeasonStatistics = statistics?.filter((s) => s.seasonType === "Post");
    loading = false;
  }
</script>

<div class="container">
  <h1>Statistics</h1>
  <select bind:value={season} on:change={fetchStatistics}>
    {#each seasons as s}
      <option value={s}>{s}</option>
    {/each}
  </select>
  <div class="statistics">
    {#if loading}
      <LoadingIndicator />
    {:else if statistics?.length === 0}
      <h3>{`No statistics yet for ${season}`}</h3>
    {:else}
      <h2>Regular season</h2>
      <table>
        {#each regularSeasonStatistics as statEntry}
          <tr>
            <td>{statEntry.description}</td>
            <td>{statEntry.value}</td>
            <td>{statEntry.user}</td>
            <td>{statEntry.valueDescription}</td>
          </tr>
        {/each}
      </table>
      <h2>Post season</h2>
      <table>
        {#each postSeasonStatistics as statEntry}
          <tr>
            <td>{statEntry.description}</td>
            <td>{statEntry.value}</td>
            <td>{statEntry.user}</td>
            <td>{statEntry.valueDescription}</td>
          </tr>
        {/each}
      </table>
    {/if}
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 18px;
  }
  table,
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

  h2 {
    text-align: center;
  }

  @media only screen and (max-width: 800px) {
    .container {
      font-size: 14px;
    }
    .statistics {
      width: 95%;
    }
  }
</style>
