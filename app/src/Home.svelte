<script>
  import { Navigate } from "svelte-router-spa";
  import { loggedInUser } from "./auth.js";

  loggedInUser.set(null);
</script>

<h1>THIS IS HOME</h1>
Now I want to generate a
<Navigate to="/login">link to /login</Navigate>
