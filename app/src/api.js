const url = "https://localhost:5003/api";

export {
  login,
  register,
  fetchGamesForCurrentWeek,
  fetchGames,
  fetchBets,
  fetchFinishedBets,
  makeBets,
  createLeague,
  fetchLeagues,
  fetchLeague,
  joinLeague,
  deleteLeague
};

const login = async (user) => {
  const response = await makeUnauthenticatedRequest(`${url}/users/login`, "POST", JSON.stringify(user));
  return response.json();
};

const register = async (user) => {
  const response = await makeUnauthenticatedRequest(`${url}/users/register`, "POST", JSON.stringify(user));
  return response.json();
};

const fetchGames = async (week) => {
  const response = await makeUnauthenticatedRequest(`${url}/games?week=${week}`, "GET");
  return response.json();
};

const fetchGamesForCurrentWeek = async () => {
  const response = await makeUnauthenticatedRequest(`${url}/games/currentWeek`, "GET");
  return response.json();
};

const fetchBets = async (week, user) => {
  const response = await makeAuthenticatedRequest(`${url}/bets?game.week=${week}&user.id=${user.id}`, "GET", null, user);
  return response.json();
};

const fetchFinishedBets = async (user) => {
  const response = await makeAuthenticatedRequest(`${url}/bets?finished=true`, "GET", null, user);
  return response.json();
};

const makeBets = async (bets, user, league) => {
  const leagueId = league ? league.id : null;
  var body = [];
  Object.keys(bets).forEach((k) => {
    body.push({
      userId: user.id,
      gameId: k,
      winningTeamId: bets[k],
      leagueId: leagueId,
    });
  });

  const response = await makeAuthenticatedRequest(`${url}/bets`, "POST", JSON.stringify(body), user) //TODO: Error handling?
};

const createLeague = async (name, user) => {
  const body = { name };
  const response = await makeAuthenticatedRequest(`${url}/leagues`, "POST", JSON.stringify(body), user);
  return response.json();
};

const fetchLeagues = async (user) => {
  const response = await makeAuthenticatedRequest(`${url}/leagues`, "GET", null, user);
  return response.json();
};

const fetchLeague = async (user, leagueId) => {
  const response = await makeAuthenticatedRequest(`${url}/leagues/${leagueId}`, "GET", null, user);
  return response.json();
};

const joinLeague = async (user, leagueId) => {
  const body = {
    userId: user.id
  };
  const response = await makeAuthenticatedRequest(`${url}/leagues/${leagueId}/join`, "PUT", JSON.stringify(body), user);
  return response.json();
};

const deleteLeague = async (user, leagueId) => {
  console.log(user);
  console.log(leagueId);
  const response = await makeAuthenticatedRequest(`${url}/leagues/${leagueId}`, "DELETE", null, user);
  return response.json();
};

const makeUnauthenticatedRequest = (url, method, body) => {
  const headers = {
    "Content-Type": "application/json",
  };
  return fetch(url, {
    method, headers, body
  });
}
const makeAuthenticatedRequest = (url, method, body, user) => {
  console.log(user);
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${user.token}`, //TODO: I don't want to have to to this.
  };
  return fetch(url, {
    method, headers, body
  });
};
