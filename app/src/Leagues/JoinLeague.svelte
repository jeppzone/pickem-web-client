<script>
  import { createEventDispatcher } from "svelte";
  import { toast } from "@zerodevx/svelte-toast";
  import { joinLeague } from "../api";
  import { loggedInUser } from "../auth";
  import LoadingIndicator from "../LoadingIndicator.svelte";
  export let league;
  let loading = false;

  const dispatch = createEventDispatcher();

  async function join() {
    console.log(league);
    loading = true;
    const joinedLeague = await joinLeague($loggedInUser, league.id);
    dispatch("join-league-succeeded", { joinedLeague });
    loading = false;
    toast.push("League joined");
  }
</script>

{#if loading}
  <LoadingIndicator />
{:else}
  <button on:click={join}> Join League </button>
{/if}

<style>
  button {
    width: 200px;
    margin-top: 10px;
    color: white;
    background-color: rgb(231, 117, 52);
  }
</style>
