<script>
	// @ts-nocheck
	import { goto } from '$app/navigation';
	import { jwtDecode } from 'jwt-decode';
	import { loggedInUser } from '../auth.js';

	if (isLoggedIn()) {
		goto('/bets');
	}

	function isLoggedIn() {
		if ($loggedInUser !== null) {
			let decoded = jwtDecode($loggedInUser.token);
			let nowSeconds = Math.floor(Date.now() / 1000);
			return decoded.exp > nowSeconds;
		}
		return false;
	}
</script>

<section>
	<h1 class="text-7xl text-center py-5 font-extrabold">NFL Pickem</h1>
	<h2 class="text-5xl text-center py-5 font-extrabold">
		Pick NFL games with real odds and compete against your friends!
	</h2>
	<h3 class="text-3xl text-center pt-10 pb-5 font-extrabold">Make and view your picks</h3>
	<div class="mockup-browser border border-primary bg-base-300">
		<div class="mockup-browser-toolbar">
			<div class="input">https://nflpickem.jeppzonestudios.se/picks</div>
		</div>
		<div class="flex justify-center px-4 py-16 bg-base-200">
			<img src="/picks.png" alt="Example of picks" />
		</div>
	</div>
	<h3 class="text-3xl text-center pt-10 pb-5 font-extrabold">
		Compare your results against everybody else
	</h3>
	<div class="mockup-browser border border-primary bg-base-300">
		<div class="mockup-browser-toolbar">
			<div class="input">https://nflpickem.jeppzonestudios.se/leaderboards</div>
		</div>
		<div class="flex justify-center px-4 py-16 bg-base-200">
			<img src="/leaderboards.png" alt="Example of picks" />
		</div>
	</div>

	<h3 class="text-3xl text-center pt-10 pb-5 font-extrabold">
		See crazy statistics from the season
	</h3>
	<div class="mockup-browser border border-primary bg-base-300">
		<div class="mockup-browser-toolbar">
			<div class="input">https://nflpickem.jeppzonestudios.se/statistics</div>
		</div>
		<div class="flex justify-center px-4 py-16 bg-base-200">
			<img src="/statistics.png" alt="Example of picks" />
		</div>
	</div>
</section>
