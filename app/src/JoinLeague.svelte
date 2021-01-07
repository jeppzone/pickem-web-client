<script>
  import { joinLeague } from "./api";
  import { loggedInUser } from "./auth";
  export let league;

  async function join() {
    const response = await joinLeague($loggedInUser, league.id);
    console.log("Attempting to join ", league.id);
  }
</script>

<button on:click={join}>Join</button>
