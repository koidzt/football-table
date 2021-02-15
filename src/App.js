import { useEffect, useState } from 'react';
import './App.css';
const _ = require('lodash');

//Fetch Clubs
const fetchClubsData = async () => {
  let resClubs = await fetch('/en.1.clubs.json', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
  resClubs = await resClubs.json();
  resClubs = resClubs.clubs;

  return resClubs;
};

//Fetch Rounds
const fetchRoundsData = async () => {
  let resRounds = await fetch('/en.1.json', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
  resRounds = await resRounds.json();
  resRounds = resRounds.rounds;

  return resRounds;
};

//Created Match Result for each Clubs
const matchResultsForEachClub = (resClubs) => {
  let matchResults = {};
  _.forEach(resClubs, (club) => {
    matchResults[club.name] = {
      name: club.name,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      point: 0,
    };
  });
  // console.log(matchResults);

  return matchResults;
};

//Updated Match Results
const updatedMatchResults = (newMatchResults, resRounds) => {
  let matchResults = { ...newMatchResults };
  _.forEach(resRounds, (round) => {
    _.forEach(round.matches, (match) => {
      if (match.score.ft[0] === match.score.ft[1]) {
        const drawnClubs = [match.team1, match.team2];
        _.forEach(drawnClubs, (name) => {
          matchResults[name] = {
            ...matchResults[name],
            played: matchResults[name].played + 1,
            drawn: matchResults[name].drawn + 1,
            point: matchResults[name].point + 1,
          };
        });
      } else {
        const clubWin = match.score.ft[0] > match.score.ft[1] ? match.team1 : match.team2;
        // Win
        matchResults[clubWin] = {
          ...matchResults[clubWin],
          played: matchResults[clubWin].played + 1,
          won: matchResults[clubWin].won + 1,
          point: matchResults[clubWin].point + 3,
        };

        const clubLost = match.score.ft[0] < match.score.ft[1] ? match.team1 : match.team2;
        //Lost
        matchResults[clubLost] = {
          ...matchResults[clubLost],
          played: matchResults[clubLost].played + 1,
          lost: matchResults[clubLost].lost + 1,
        };
      }
    });
  });

  return matchResults;
};

//Sort Match Results By Points and Change Object to Array
const sortRankForEachClub = (matchResults) => {
  const sortPointsByDesc = _.sortBy(matchResults, 'point').reverse();
  return sortPointsByDesc;
};

function App() {
  const [clubs, setClubs] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [sumClubs, setSumClubs] = useState([]);

  useEffect(async () => {
    const fetchClubs = await fetchClubsData();
    const fetchRounds = await fetchRoundsData();
    const newMatchResults = matchResultsForEachClub(fetchClubs);
    const matchResults = updatedMatchResults(newMatchResults, fetchRounds);
    const rankClubs = sortRankForEachClub(matchResults);

    setClubs(fetchClubs);
    setRounds(fetchRounds);
    setSumClubs(rankClubs);
  }, []);

  return (
    <div className="App">
      <div className="container">
        <h2>Premier League 2017/18</h2>

        <table className="table container">
          <thead>
            <tr>
              <th colSpan="2">Club</th>
              <th>Played</th>
              <th>Won</th>
              <th>Drawn</th>
              <th>Lost</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {sumClubs.map((club, i) => (
              <tr key={club.name}>
                <td>{i + 1}</td>
                <td>{club.name}</td>
                <td>{club.played}</td>
                <td>{club.won}</td>
                <td>{club.drawn}</td>
                <td>{club.lost}</td>
                <td>{club.point}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
