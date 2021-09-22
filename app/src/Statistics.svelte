<script>
  import { onMount } from "svelte";
  import { getStatistics } from "./api";
  import { loggedInUser } from "./auth";
  import LoadingIndicator from "./LoadingIndicator.svelte";

  let statistics = [];
  let loading = false;

  onMount(async () => {
    loading = true;
    statistics = await getStatistics($loggedInUser);
    loading = false;
  });
</script>

<div class="container">
  <h2>Statistics</h2>
  {#if loading}
    <LoadingIndicator />
  {:else}
    <table>
      {#each statistics as statEntry}
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

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
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
</style>
