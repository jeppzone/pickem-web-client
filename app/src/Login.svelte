<script>
  import { login, register } from "./api";
  import { loggedInUser } from "./auth.js";
  import { onMount } from "svelte";
  import { navigateTo } from "svelte-router-spa";
  let username;
  let password;
  let email;
  let registerToggled = false;

  function toggleMode() {
    registerToggled = !registerToggled;
  }

  async function loginUser() {
    const user = await login({ username, password });
    $loggedInUser = user;
    navigateTo("/");
  }

  async function registerUser() {
    const user = await register({ username, password });
    $loggedInUser = user;
    navigateTo("/");
  }

  onMount(() => {
    if ($loggedInUser !== null) navigateTo("/");
  });
</script>

<style>
  .container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  .login {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 360px;
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
    padding: 2vw;
  }
  @media (max-width: 600px) {
    .login {
      align-items: flex-start;
    }
  }
</style>

<main class="container">
  <div class="login">
    {#if registerToggled}
      <h1>Register to Pick'em</h1>
      <form on:submit|preventDefault={registerUser}>
        <label for="username">Username</label>
        <input id="username" bind:value={username} type="text" />
        <label for="email">Email</label>
        <input id="email" bind:value={email} type="email" />
        <label for="password">Password</label>
        <input id="password" bind:value={password} type="password" />
        <input type="submit" value="Register" />
      </form>
      <span on:click={toggleMode}>or Login</span>
    {:else}
      <h1>Login to Pick'em</h1>
      <form on:submit|preventDefault={loginUser}>
        <label for="username">Username</label>
        <input id="username" bind:value={username} type="text" />
        <label for="password">Password</label>
        <input id="password" bind:value={password} type="password" />
        <input type="submit" value="Login" />
      </form>
      <span on:click={toggleMode}>or Register</span>
    {/if}
  </div>
</main>
