const url = "https://localhost:5003/api";

export { login, register, fetchGames, fetchBets, makeBets };

const login = async (user) => {
  const response = await fetch(`${url}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  return response.json();
};

const register = async (user) => {
  const response = await fetch(`${url}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  return response.json();
};

const fetchGames = async (week) => {
  const response = await fetch(`${url}/games?week=${week}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
};

const fetchBets = async (week, user) => {
  console.log(week);
  console.log(user);
  const response = await fetch(
    `${url}/bets?game.week=${week}&user.id=${user.id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.token}`, //TODO: I don't want to have to to this.
      },
    }
  );
  return response.json();
};

const makeBets = async (bets, user, league) => {
  console.log(user);
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

  console.log(body);

  const response = await fetch(`${url}/bets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${user.token}`,
    },
    body: JSON.stringify(body),
  });
};
