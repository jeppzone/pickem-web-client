<script>
  import { createEventDispatcher } from "svelte";
  import { toast } from "@zerodevx/svelte-toast";
  import Fa from "svelte-fa";
  import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
  import { joinLeague } from "../api";
  import { loggedInUser } from "../auth";
  export let league;

  const dispatch = createEventDispatcher();

  async function join() {
    const joinedLeague = await joinLeague($loggedInUser, league.id);
    dispatch("join-league-succeeded", { joinedLeague });
    toast.push("League joined");
  }
</script>

<span on:click={join}><Fa icon={faUserPlus} size="lg" /></span>

<style>
  span {
    border: none;
    background-color: transparent;
    color: white;
    cursor: pointer;
  }
</style>
