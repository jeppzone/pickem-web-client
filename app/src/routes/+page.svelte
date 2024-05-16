<script>
	// @ts-nocheck
	import { goto } from '$app/navigation';
	import { jwtDecode } from 'jwt-decode';
	import { loggedInUser } from '../auth.js';

	if (isLoggedIn()) {
		goto('/bets');
	} else {
		goto('/login');
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
