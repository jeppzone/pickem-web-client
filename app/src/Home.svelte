<script>
  import { Navigate } from "svelte-router-spa";
</script>

<h1>Welcome to Pick'em!</h1>
<Navigate to="/leagues"><button>Join a league</button></Navigate>
and <Navigate to="/bets"><button>Make bets</button></Navigate>
or <Navigate to="/games"><button>Follow games</button></Navigate>