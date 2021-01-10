<script>
  import { deleteLeague } from "../api";
  import { loggedInUser } from "../auth";
  export let league;

  async function delLeague() {
    const response = await deleteLeague($loggedInUser, league.id);
    console.log("Attempting to join ", league.id);
  }
</script>

<style>
  button {
  background-color: rgb(241, 76, 95);
  color: white;
  cursor: pointer;
}
</style>

<button on:click={delLeague}>Delete</button>
