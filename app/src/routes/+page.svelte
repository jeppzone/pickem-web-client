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

	<div class="pt-10">
		<a href="/register" class="w-full flex justify-center">
			<button class="btn btn-primary text-primary-content md:w-1/2 xs:w-full">Register</button>
		</a>
	</div>
</section>

<svelte:head>
	<!-- Title -->
	<title>NFL Pick'em - Predict the Winners and Dominate the Leaderboard</title>

	<!-- Meta Description -->
	<meta
		name="description"
		content="Join our NFL Pick'em league and predict the winners of each game. Compete against friends and football fans worldwide to see who can dominate the leaderboard."
	/>

	<!-- Meta Keywords -->
	<meta
		name="keywords"
		content="NFL Pick'em, NFL Pickem, NFL predictions, football picks, NFL betting, sports league, NFL leaderboard, weekly picks, football competition"
	/>

	<!-- Open Graph Meta Tags -->
	<meta
		property="og:title"
		content="NFL Pick'em - Predict the Winners and Dominate the Leaderboard"
	/>
	<meta
		property="og:description"
		content="Join our NFL Pick'em league and predict the winners of each game. Compete against friends and football fans worldwide to see who can dominate the leaderboard."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://nflpickem.jeppzonestudios.se" />
	<meta property="og:image" content="https://nflpickem.jeppzonestudios.se/logo-text.png" />

	<!-- Twitter Card Meta Tags -->
	<meta
		name="twitter:title"
		content="NFL Pick'em - Predict the Winners and Dominate the Leaderboard"
	/>
	<meta
		name="twitter:description"
		content="Join our NFL Pick'em league and predict the winners of each game. Compete against friends and football fans worldwide to see who can dominate the leaderboard."
	/>

	<!-- Canonical Link -->
	<link rel="canonical" href="https://nflpickem.jeppzonestudios.se" />

	<!-- Favicon -->
	<link rel="icon" href="/favicon.png" type="image/x-icon" />
</svelte:head>
