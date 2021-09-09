<script>
  import { Navigate } from "svelte-router-spa";
  import Games from "./Games.svelte";
</script>

<main class="container">
  <section class="title">
    <img src="./assets/logo-text.png" alt="Pickem" />
  </section>
  <section class="description">
    <h3>Join a league. Make bets. Compete against others!</h3>
  </section>
  <section class="navigation">
    <Navigate to="/leagues"
      ><button class="button">Join a league</button></Navigate
    >
    <p />
    <Navigate to="/bets"><button class="button">Make bets</button></Navigate>
  </section>
  <Games />
</main>

<style>
  .title {
    display: flex;
    justify-content: center;
    padding: 20px;
  }
  .title img {
    width: 200px;
  }
  .description {
    width: 100%;
    display: flex;
    justify-content: center;
    font-size: 1.5em;
  }
  .navigation {
    display: flex;
    justify-content: center;
  }
  .navigation p {
    padding-left: 1vw;
    padding-right: 1vw;
  }
  button {
    color: white;
    cursor: pointer;
  }
  .button {
    background-color: rgb(231, 117, 52);
  }
</style>
