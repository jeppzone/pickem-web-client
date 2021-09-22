const url = "https://pickem-api-dev.herokuapp.com/api";
// const url = "http://localhost:5002/api";

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
  deleteLeague,
  getStatistics
};

const login = async (user) => {
  const response = await makeUnauthenticatedRequest(`${url}/users/login`, "POST", JSON.stringify(user));
  return response.json();
};

const register = async (user) => {
  const response = await makeUnauthenticatedRequest(`${url}/users/register`, "POST", JSON.stringify(user));
  return response.json();
};

const fetchGames = async (season, seasonType, week) => {
  const response = await makeUnauthenticatedRequest(`${url}/games?season=${season}&seasonType=${seasonType}&week=${week}`, "GET");
  return response.json();
};

const fetchGamesForCurrentWeek = async () => {
  const response = await makeUnauthenticatedRequest(`${url}/games/currentWeek`, "GET");
  return response.json();
};

const fetchBets = async (season, seasonType, week, user) => {
  const response = await makeAuthenticatedRequest(
    `${url}/bets?game.season=${season}&game.seasonType=${seasonType}&game.week=${week}&user.id=${user.id}`,
    "GET",
    null,
    user
  );
  return response.json();
};

const fetchFinishedBets = async (user) => {
  const response = await makeAuthenticatedRequest(`${url}/bets?finished=true`, "GET", null, user);
  return response.json();
};

const makeBets = async (bets, user) => {
  var body = [];
  Object.keys(bets).forEach((k) => {
    body.push({
      userId: user.id,
      gameId: k,
      winningTeamId: bets[k],
    });
  });

  const response = await makeAuthenticatedRequest(`${url}/bets`, "POST", JSON.stringify(body), user); //TODO: Error handling?
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
    userId: user.id,
  };
  const response = await makeAuthenticatedRequest(`${url}/leagues/${leagueId}/join`, "PUT", JSON.stringify(body), user);
  return response.json();
};

const deleteLeague = async (user, leagueId) => {
  const response = await makeAuthenticatedRequest(`${url}/leagues/${leagueId}`, "DELETE", null, user);
  if (!response.ok) {
    throw new Error("Something went wrong");
  }
};

const getStatistics = async (user) => {
  const response = await makeAuthenticatedRequest(`${url}/statistics`, "GET", null, user);
  return response.json();
}

const makeUnauthenticatedRequest = async (url, method, body) => {
  const headers = {
    "Content-Type": "application/json",
  };
  const response = await fetch(url, {
    method,
    headers,
    body,
  });

  if (!response.ok) {
    throw new Error("Something went wrong");
  }

  return response;
};
const makeAuthenticatedRequest = async (url, method, body, user) => {
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${user.token}`, //TODO: I don't want to have to to this.
  };
  const response = await fetch(url, {
    method,
    headers,
    body,
  });

  if (!response.ok) {
    throw new Error("Something went wrong");
  }

  return response;
};
