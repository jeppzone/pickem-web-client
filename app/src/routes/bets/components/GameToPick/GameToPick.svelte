<script>
	import { displayDate } from '$lib/shared/utils';
	import GameToPickTeamDisplay from './GameToPickTeamDisplay.svelte';

	/**
	 * @type {Game}
	 */
	export let game;

	/**
	 * @param {Game} game
	 */

	$: pick = '';

	/**
	 * @type {(arg0: { gameId: string; winningTeamId: string; }) => void}
	 */
	export let handlePick;

	/**
	 * @type {(arg0: string) => void}
	 */
	function dispatch(teamId) {
		pick = teamId;
		handlePick({ gameId: game.id, winningTeamId: teamId });
	}
</script>

<div class="bg-neutral rounded-xl px-5 mt-5">
	<div class="py-2 italic font-bold tracking-wide">{displayDate(game)}</div>
	<div class="grid grid-cols-1 pb-5 gap-4">
		<GameToPickTeamDisplay
			logo={game.homeTeam.logo}
			name={game.homeTeam.name}
			abbreviation={game.homeTeam.abbreviation}
			id={game.homeTeam.id}
			odds={game.homeTeamOdds}
			{dispatch}
			selected={pick === game.homeTeam.id}
		/>
		<GameToPickTeamDisplay
			logo={game.awayTeam.logo}
			name={game.awayTeam.name}
			abbreviation={game.awayTeam.abbreviation}
			id={game.awayTeam.id}
			odds={game.awayTeamOdds}
			{dispatch}
			selected={pick === game.awayTeam.id}
		/>
	</div>
</div>
