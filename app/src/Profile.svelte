<script>
  import { onMount } from "svelte";
  import { getProfile } from "./api";
  import { loggedInUser } from "./auth";
  import LoadingIndicator from "./LoadingIndicator.svelte";

  let profile = {};
  let loading = false;
  onMount(async () => {
    loading = true;
    try {
      profile = await getProfile($loggedInUser);
      loading = false;
    } catch (err) {
      loading = false;
    }
  });
</script>

<div class="container">
  <h1>{$loggedInUser.username}</h1>
  {#if loading}
    <LoadingIndicator />
  {:else}
    <h3>
      All time record: {profile.nbrOfCorrectBets} - {profile.nbrOfIncorrectBets}
    </h3>
  {/if}
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    font-size: 18px;
  }
</style>
