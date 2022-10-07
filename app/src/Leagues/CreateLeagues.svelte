<script>
  import { createEventDispatcher } from "svelte";
  import { toast } from "@zerodevx/svelte-toast";
  import { loggedInUser } from "../auth";
  import { createLeague } from "../api";
  import LoadingIndicator from "../LoadingIndicator.svelte";
  const dispatch = createEventDispatcher();
  let name = "";
  let loading = false;

  async function create() {
    loading = true;
    const createdLeague = await createLeague(name, $loggedInUser);
    dispatch("create-league-succeeded", { createdLeague });
    loading = false;
    toast.push("League created");
    cancel();
  }

  function cancel() {
    dispatch("create-league-cancelled");
  }
</script>

{#if loading}
  <LoadingIndicator />
{:else}
  <h2>Create a league</h2>
  <label for="name">Name</label>
  <input id="name" bind:value={name} type="text" />
  <div class="buttons">
    <button class="button-apply" on:click={create}>Create</button>
    <button class="button-cancel" on:click={cancel}>Cancel</button>
  </div>
{/if}

<style>
  .buttons {
    display: flex;
  }

  .buttons button {
    margin: 1em;
  }

  button {
    color: white;
    cursor: pointer;
  }
  .button-apply {
    background-color: rgb(231, 117, 52);
  }

  .button-cancel {
    background-color: rgb(66, 63, 61);
  }
</style>
