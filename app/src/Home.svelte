<script>
  import { Navigate } from "svelte-router-spa";
  import Games from "./Games.svelte";
</script>

<main class="container">
  <section class="title">
    <img src="./assets/logo-text.png" alt="Pickem" />
  </section>
  <section class="description">
    <p>Make bets. Compete against others. No money involved!</p>
  </section>
  <section class="navigation">
    <Navigate to="/leagues"><button class="button">Join a league</button></Navigate>
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
    background-color: rgb(0, 18, 29);
  }
  .navigation {
    display: flex;
    justify-content: center;
    background-color: rgb(0, 18, 29);
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
    background-color: #f2a065;
  }
  .container {
    height: 100vh;
    margin: 0;
    color: white;
    background: #141e30; /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, #243b55, #141e30); /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, #243b55, #141e30); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  }
</style>
