import { jwtDecode } from 'jwt-decode';

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

export function isLoggedIn(user) {
	if (user !== null) {
		let decoded = jwtDecode(user.token);
		let nowSeconds = Math.floor(Date.now() / 1000);
		return decoded.exp > nowSeconds;
	}
	return false;
}

export function groupByArray(array, key) {
	return array.reduce(function (groups, element) {
		let v = key instanceof Function ? key(element) : element[key];
		let group = groups.find((r) => r && r.key === v);
		if (group) {
			group.values.push(element);
		} else {
			groups.push({ key: v, values: [element] });
		}
		return groups;
	}, []);
}

export function getCurrentSeason() {
	return 2023;
}

export function getSeasons() {
	return [2023, 2022, 2021];
}
