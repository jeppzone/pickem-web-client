<script>
  import { createEventDispatcher } from "svelte";
  import { toast } from "@zerodevx/svelte-toast";
  import { loggedInUser } from "../auth";
  import { createLeague } from "../api";
  const dispatch = createEventDispatcher();
  let name = "";

  async function create() {
    const createdLeague = await createLeague(name, $loggedInUser);
    dispatch("create-league-succeeded", { createdLeague });
    toast.push("League created");
  }

  function cancel() {
    dispatch("create-league-cancelled");
  }
</script>

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

<h2>Create a league</h2>
<label for="name">Name</label>
<input id="name" bind:value={name} type="text" />
<div class="buttons">
  <button class="button-apply" on:click={create}>Create</button>
  <button class="button-cancel" on:click={cancel}>Cancel</button>
</div>
