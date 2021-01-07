<script>
  import { loggedInUser } from "./auth.js";
  import { createLeague } from "./api";
  let name = "";

  async function create() {
    const createdLeague = await createLeague(name, $loggedInUser); 
  }
</script>

<h2>Create a league</h2>
<label for="name">Name</label>
<input id="name" bind:value={name} type="text" />
<button on:click={create}>Create</button>
