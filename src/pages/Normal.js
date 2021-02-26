import { useEffect, useState } from 'react';
import _forEach from 'lodash/forEach';
import _sortBy from 'lodash/sortBy';

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
  _forEach(resClubs, (club) => {
    matchResults[club.name] = {
      name: club.name,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    };
  });
  // console.log(matchResults);

  return matchResults;
};

//Updated Match Results
const updatedMatchResults = (newMatchResults, resRounds) => {
  let matchResults = { ...newMatchResults };
  _forEach(resRounds, (round) => {
    _forEach(round.matches, (match) => {
      if (match.score.ft[0] === match.score.ft[1]) {
        const drawnClubs = [match.team1, match.team2];
        _forEach(drawnClubs, (name) => {
          matchResults[name] = {
            ...matchResults[name],
            played: matchResults[name].played + 1,
            drawn: matchResults[name].drawn + 1,
            points: matchResults[name].points + 1,
            goalsFor: matchResults[name].goalsFor + match.score.ft[0],
            goalsAgainst: matchResults[name].goalsAgainst + match.score.ft[0],
          };
        });
      }
      if (match.score.ft[0] > match.score.ft[1]) {
        //Win
        matchResults[match.team1] = {
          ...matchResults[match.team1],
          played: matchResults[match.team1].played + 1,
          won: matchResults[match.team1].won + 1,
          points: matchResults[match.team1].points + 3,
          goalsFor: matchResults[match.team1].goalsFor + match.score.ft[0],
          goalsAgainst: matchResults[match.team1].goalsAgainst + match.score.ft[1],
          goalDifference: matchResults[match.team1].goalDifference + (match.score.ft[0] - match.score.ft[1]),
        };

        //Lost
        matchResults[match.team2] = {
          ...matchResults[match.team2],
          played: matchResults[match.team2].played + 1,
          lost: matchResults[match.team2].lost + 1,
          goalsFor: matchResults[match.team2].goalsFor + match.score.ft[1],
          goalsAgainst: matchResults[match.team2].goalsAgainst + match.score.ft[0],
          goalDifference: matchResults[match.team2].goalDifference + (match.score.ft[1] - match.score.ft[0]),
        };
      }
      if (match.score.ft[0] < match.score.ft[1]) {
        //Lost
        matchResults[match.team1] = {
          ...matchResults[match.team1],
          played: matchResults[match.team1].played + 1,
          lost: matchResults[match.team1].lost + 1,
          goalsFor: matchResults[match.team1].goalsFor + match.score.ft[0],
          goalsAgainst: matchResults[match.team1].goalsAgainst + match.score.ft[1],
          goalDifference: matchResults[match.team1].goalDifference + (match.score.ft[0] - match.score.ft[1]),
        };
        //Win
        matchResults[match.team2] = {
          ...matchResults[match.team2],
          played: matchResults[match.team2].played + 1,
          won: matchResults[match.team2].won + 1,
          points: matchResults[match.team2].points + 3,
          goalsFor: matchResults[match.team2].goalsFor + match.score.ft[1],
          goalsAgainst: matchResults[match.team2].goalsAgainst + match.score.ft[0],
          goalDifference: matchResults[match.team2].goalDifference + (match.score.ft[1] - match.score.ft[0]),
        };
      }
    });
  });

  return matchResults;
};

//Sort Match Results By Points and Change Object to Array
const sortRankForEachClub = (matchResults) => {
  const sortGdByDesc = _sortBy(matchResults, 'gd');
  const sortPointsByDesc = _sortBy(sortGdByDesc, 'points').reverse();

  return sortPointsByDesc;
};

function Normal() {
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
    <div className="container">
      <h2>Premier League 2017/18</h2>

      <table className="table container">
        <thead>
          <tr>
            <th>Position</th>
            <th>Club</th>
            <th>Played</th>
            <th>Won</th>
            <th>Drawn</th>
            <th>Lost</th>
            <th>GF</th>
            <th>GA</th>
            <th>GD</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {sumClubs.map((club, i) => (
            <tr key={club.name}>
              <td>{i + 1}</td>
              <td className="text-start">{club.name}</td>
              <td>{club.played}</td>
              <td>{club.won}</td>
              <td>{club.drawn}</td>
              <td>{club.lost}</td>
              <td>{club.goalsFor}</td>
              <td>{club.goalsAgainst}</td>
              <td>{club.goalDifference}</td>
              <td>{club.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Normal;
