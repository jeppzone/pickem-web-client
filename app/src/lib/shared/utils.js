/**
 * @param {{ startTime: Date; isFinished: boolean; }} game
 */
export function displayDate(game) {
	const date = game.startTime;
	if (game.isFinished) {
		return 'FINAL';
	}
	return `${new Date(date).toLocaleDateString()} ${new Date(date).toLocaleTimeString()}`;
}

export function displayTeamName(width, name, abbreviation) {
	return width > 800 ? name : abbreviation;
}
