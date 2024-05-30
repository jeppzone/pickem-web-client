<script>
	// @ts-nocheck

	import { goto } from '$app/navigation';
	import { register } from '../../api';
	import { loggedInUser } from '../../auth.js';
	let username;
	let password;
	let loading = false;
	let error;

	async function registerUser() {
		try {
			error = '';
			loading = true;
			const user = await register({ username, password });
			$loggedInUser = user;
			goto('/');
		} catch (err) {
			error = 'There was a problem when registering. Please try again';
		} finally {
			loading = false;
		}
	}
</script>

<section class="flex items-center flex-col justify-center my-auto">
	<img src="/logo-text.png" class="rounded mb-10" alt="Pickem logo" />
	<h1 class="text-center text-5xl font-extrabold pb-5">Register</h1>
	<div class="card w-96 bg-base-300-content shadow-xl">
		<div class="card-body">
			<form on:submit|preventDefault={registerUser} class="">
				<div class="form-control">
					<label class="label" for="username">
						<span class="label-text text-white">Username</span>
					</label>
					<input
						id="username"
						type="text"
						bind:value={username}
						placeholder="Username"
						class="input input-bordered"
						required
					/>
				</div>
				<div class="form-control mt-4">
					<label class="label" for="password">
						<span class="label-text text-white">Password</span>
					</label>
					<input
						id="password"
						type="password"
						bind:value={password}
						placeholder="Password"
						class="input input-bordered"
						required
					/>
				</div>
				<div class="form-control mt-6">
					<button type="submit" class="btn btn-primary">
						{#if loading}
							<span class="loading loading-spinner"></span>
						{:else}
							Register
						{/if}</button
					>
				</div>
				<div class="mt-6">
					<a href="/login">
						<button class="btn btn-outline btn-primary border-none">Or Login</button>
					</a>
				</div>
			</form>
		</div>
		{#if error}
			<div class="toast toast-bottom toast-end">
				<div class="alert bg-error border-none">
					<span>{error}</span>
				</div>
			</div>
		{/if}
	</div>
</section>

<svelte:head>
	<!-- Title -->
	<title>Register | NFL Pick'em</title>

	<!-- Meta Description -->
	<meta
		name="description"
		content="Create your NFL Pick'em account to join the excitement of predicting game winners and competing with friends. Sign up today!"
	/>

	<!-- Meta Keywords -->
	<meta
		name="keywords"
		content="NFL Pick'em registration, NFL Pickem, NFL picks, register, football picks, sports registration, NFL predictions"
	/>

	<!-- Open Graph Meta Tags -->
	<meta property="og:title" content="Register | NFL Pick'em" />
	<meta
		property="og:description"
		content="Create your NFL Pick'em account to join the excitement of predicting game winners and competing with friends. Sign up today!"
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://nflpickem.jeppzonestudios.se/register" />
	<meta property="og:image" content="https://nflpickem.jeppzonestudios.se/logo-text.png" />

	<!-- Twitter Card Meta Tags -->
	<meta name="twitter:title" content="Register | NFL Pick'em" />
	<meta
		name="twitter:description"
		content="Create your NFL Pick'em account to join the excitement of predicting game winners and competing with friends. Sign up today!"
	/>
	<meta name="twitter:image" content="https://nflpickem.jeppzonestudios.se/logo-text.png" />
	<meta name="twitter:site" content="@YourTwitterHandle" />
	<meta name="twitter:creator" content="@YourTwitterHandle" />

	<!-- Canonical Link -->
	<link rel="canonical" href="https://nflpickem.jeppzonestudios.se/register" />

	<!-- Favicon -->
	<link rel="icon" href="/favicon.png" type="image/x-icon" />
</svelte:head>

<style>
	.card {
		@apply rounded-lg overflow-hidden;
	}

	.card-body {
		@apply p-6;
	}

	.card-title {
		@apply text-2xl font-bold mb-4;
	}

	.form-control {
		@apply w-full;
	}

	.label {
		@apply mb-2;
	}

	.input {
		@apply w-full;
	}

	.btn {
		@apply w-full;
	}
</style>
