<script>
  import { createEventDispatcher } from "svelte";
  import { toast } from "@zerodevx/svelte-toast";
  import Fa from "svelte-fa";
  import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
  import { joinLeague } from "../api";
  import { loggedInUser } from "../auth";
  import LoadingIndicator from "../LoadingIndicator.svelte";
  export let league;
  let loading = false;

  const dispatch = createEventDispatcher();

  async function join() {
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
  <span on:click={join}><Fa icon={faUserPlus} size="lg" /></span>
{/if}

<style>
  span {
    border: none;
    background-color: transparent;
    color: white;
    cursor: pointer;
  }
</style>
