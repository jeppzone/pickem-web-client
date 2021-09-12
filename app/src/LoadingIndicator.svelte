<div class="spinner" />

<style>
  @keyframes spinner {
    0% {
      transform: translate3d(-50%, -50%, 0) rotate(0deg);
    }
    100% {
      transform: translate3d(-50%, -50%, 0) rotate(360deg);
    }
  }
  .spinner {
    opacity: 1;
    position: relative;
    transition: opacity linear 0.1s;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .spinner::before {
    animation: 1s linear infinite spinner;
    border: solid 3px #eee;
    border-bottom-color: rgb(231, 117, 52);
    border-radius: 50%;
    content: "";
    height: 40px;
    left: 50%;
    opacity: inherit;
    position: absolute;
    top: 50%;
    transform: translate3d(-50%, -50%, 0);
    transform-origin: center;
    width: 40px;
    will-change: transform;
  }
</style>
