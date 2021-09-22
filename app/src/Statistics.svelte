<script>
  import { onMount } from "svelte";
  import { getStatistics } from "./api";
  import { loggedInUser } from "./auth.js";

  let statistics = [];

  onMount(async () => {
    statistics = await getStatistics($loggedInUser);
  });
</script>

<div class="container">
  <h2>Statistics</h2>
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
  .my-row td:nth-child(2) {
    border: 2px solid rgb(233, 147, 97);
  }
  tr:nth-child(odd) {
    background-color: rgb(12, 35, 49);
  }
  tr:nth-child(even) {
    background-color: rgb(12, 35, 49);
  }
</style>
