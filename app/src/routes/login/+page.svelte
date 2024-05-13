<script>
	import { goto } from '$app/navigation';
	import { login, register } from '../../api';
	import { loggedInUser } from '../../auth.js';
	// @ts-ignore
	import { SvelteToast } from '@zerodevx/svelte-toast';
	// @ts-ignore
	import { toast } from '@zerodevx/svelte-toast';
	import LoadingIndicator from '../../LoadingIndicator.svelte';
	// @ts-ignore
	let username;
	// @ts-ignore
	let password;
	let registerToggled = false;
	let loading = false;

	function toggleMode() {
		registerToggled = !registerToggled;
	}

	async function loginUser() {
		try {
			loading = true;
			// @ts-ignore
			const user = await login({ username, password });
			$loggedInUser = user;
			goto('/');
		} catch (err) {
			showError('There was a problem logging in. Please try again');
		} finally {
			loading = false;
		}
	}

	async function registerUser() {
		try {
			loading = true;
			// @ts-ignore
			const user = await register({ username, password });
			$loggedInUser = user;
			goto('/');
		} catch (err) {
			showError('There was a problem when registering. Please try again');
		} finally {
			loading = false;
		}
	}

	// @ts-ignore
	function showError(errorMessage) {
		toast.push(errorMessage, {
			theme: {
				'--toastBackground': '#f54260',
				'--toastProgressBackground': 'white'
			}
		});
	}
</script>

<main class="container">
	<div class="login">
		<div>
			<img src="assets/logo-text.png" alt="NFL Pick'em" />
		</div>
		{#if registerToggled}
			<div class="title">
				<h1>Register</h1>
			</div>
			<form on:submit|preventDefault={registerUser}>
				<div>
					<label for="username">Username</label>
					<input id="username" bind:value={username} type="text" />
					<label for="password">Password</label>
					<input id="password" bind:value={password} type="password" />
				</div>
				<button>
					<div class="loading">
						{#if loading}
							<LoadingIndicator />
						{/if}
					</div>
					Register
				</button>
			</form>
			<span class="span-button" on:click={toggleMode}>or <b>Login</b></span>
		{:else}
			<div class="title">
				<h1>Login</h1>
			</div>
			<form on:submit|preventDefault={loginUser}>
				<div>
					<label for="username">Username</label>
					<input id="username" bind:value={username} type="text" />
					<label for="password">Password</label>
					<input id="password" bind:value={password} type="password" />
				</div>
				<div class="action-button">
					<button>
						<div class="loading">
							{#if loading}
								<LoadingIndicator />
							{/if}
						</div>
						Login
					</button>
				</div>
			</form>
			<span class="span-button" on:click={toggleMode}>or <b>Register</b></span>
		{/if}
	</div>
	<SvelteToast />
</main>

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
		max-width: 90%;
	}
	.span-button {
		cursor: pointer;
		margin-top: 1em;
		font-size: 20px;
	}
	.title {
		text-align: center;
	}
	button {
		width: 100%;
		margin-top: 1em;
		cursor: pointer;
		background-color: rgb(231, 117, 52);
		color: white;
	}

	input {
		padding: 1em;
		border-radius: 5px;
		margin-bottom: 1em;
		width: 360px;
	}

	label {
		font-size: 18px;
	}

	.action-button {
		display: flex;
	}

	.loading {
		margin: auto;
		float: right;
		margin-right: 20px;
		margin-top: 10px;
	}

	@media only screen and (max-width: 800px) {
		.login,
		input,
		button {
			width: 340px;
		}
	}
</style>
