<script>
  import { Navigate } from "svelte-router-spa";
  import Games from "./Games.svelte";
</script>

<main class="container">
  <section class="title">
    <h1>Welcome to Pick'em!</h1>
  </section>
  <section class="description">
    <p>
      This is a site made for betting on NFL games with odds from real sites but with no real money involved. The only thing that is up for grabs is
      honor! Create a league and have your friends join and compete against each other too see who is the best better.
    </p>
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
  }
  .description {
    width: 80%;
    margin: auto;
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
  .container {
    height: 100vh;
    margin: 0;
    color: white;
    background: #141e30; /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, #243b55, #141e30); /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, #243b55, #141e30); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  }
</style>
