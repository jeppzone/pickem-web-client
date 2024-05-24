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

<svelte:head>
	<title>Register | NFL Pickem | Jeppzone Sports</title>
	<meta name="description" content="Register" />
</svelte:head>

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
