<script>
  import Fa from "svelte-fa";
  import { createEventDispatcher } from "svelte";
  import { toast } from "@zerodevx/svelte-toast";
  import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
  import { deleteLeague } from "../api";
  import { loggedInUser } from "../auth";
  export let league;
  export let disabled = false;

  const dispatch = createEventDispatcher();

  async function delLeague() {
    try {
      await deleteLeague($loggedInUser, league.id);
      dispatch("delete-league-succeeded", { deletedLeague: league });
      toast.push("League deleted");
    } catch (error) {
      console.log(error);
      toast.push("An error occured", {
        theme: {
          "--toastBackground": "#f54260",
          "--toastProgressBackground": "white",
        },
      });
    }
  }
</script>

<span class={disabled ? "delete disabled" : "delete"} on:click={delLeague}>
  <Fa icon={faTrashAlt} size="lg" />
</span>

<style>
  .delete {
    cursor: pointer;
  }

  .disabled {
    cursor: auto;
    opacity: 0;
  }
  span {
    color: white;
  }
</style>
