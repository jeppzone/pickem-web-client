<script>
  import { createEventDispatcher } from "svelte";
  import { toast } from "@zerodevx/svelte-toast";
  import { deleteLeague } from "../api";
  import { loggedInUser } from "../auth";
  import LoadingIndicator from "../LoadingIndicator.svelte";
  import { navigateTo } from "svelte-router-spa";
  export let league;
  let loading = false;

  const dispatch = createEventDispatcher();

  async function delLeague() {
    try {
      loading = true;
      await deleteLeague($loggedInUser, league.id);
      loading = false;
      toast.push("League deleted");
      navigateTo("/leagues");
    } catch (error) {
      loading = false;
      toast.push("An error occured", {
        theme: {
          "--toastBackground": "#f54260",
          "--toastProgressBackground": "white",
        },
      });
    }
  }
</script>

{#if loading}
  <LoadingIndicator />
{:else}
  <button on:click={delLeague}>Delete league</button>
{/if}

<style>
  button {
    width: 200px;
    margin-top: 10px;
    color: white;
    background-color: rgb(231, 117, 52);
  }
</style>
