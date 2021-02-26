import { useEffect, useState } from 'react';
import Team from '../components/Team';
import _sortBy from 'lodash/sortBy';

//Fetch Rounds
const fetchRoundsData = async () => {
  let resRounds = await fetch('/en.1.json', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
  resRounds = await resRounds.json();

  //spread matches
  const allMatches = resRounds.rounds.reduce((acc, round) => {
    acc = [...acc, ...round.matches];
    return acc;
  }, []);

  return allMatches;

  // const sortMatches = allMatches.sort((a, b) => a.date > b.date); // 2017-11-04 --> 2018-05-13
  // const sortMatches = allMatches.sort((a, b) => (a.date > b.date ? -1 : 1)); //  2018-05-13 --> 2017-11-04

  // return sortMatches;
};

// Updates Goals
const updatedGoals = (match, team1, team2) => {
  team1.gf = team1.gf + match.score.ft[0];
  team1.ga = team1.ga + match.score.ft[1];
  team1.gd = team1.gd + match.score.ft[0] - match.score.ft[1];
  team2.gf = team2.gf + match.score.ft[1];
  team2.ga = team2.ga + match.score.ft[0];
  team2.gd = team2.gd + match.score.ft[1] - match.score.ft[0];
};

// Compute Match Results
const computeMatchResults = (allMatches) => {
  const computedData = allMatches.reduce((acc, match) => {
    if (!acc[match.team1]) {
      acc[match.team1] = new Team(match.team1);
    }
    if (!acc[match.team2]) {
      acc[match.team2] = new Team(match.team2);
    }

    acc[match.team1].addPlayed();
    acc[match.team2].addPlayed();

    if (match.score.ft[0] > match.score.ft[1]) {
      acc[match.team1].updatedMatchResults('won');
      acc[match.team2].updatedMatchResults('lost');
    }
    if (match.score.ft[0] < match.score.ft[1]) {
      acc[match.team1].updatedMatchResults('lost');
      acc[match.team2].updatedMatchResults('won');
    }
    if (match.score.ft[0] === match.score.ft[1]) {
      acc[match.team1].updatedMatchResults('drawn');
      acc[match.team2].updatedMatchResults('drawn');
    }

    updatedGoals(match, acc[match.team1], acc[match.team2]);

    return acc;
  }, {});

  return computedData;
};

//Sort Match Results By Points and Change Object to Array
const sortRankForEachClub = (matchResults) => {
  const sortGdByDesc = _sortBy(matchResults, 'gd');
  const sortPointsByDesc = _sortBy(sortGdByDesc, 'points').reverse();

  return sortPointsByDesc;
};

function ClassTeam() {
  const [clubs, setClubs] = useState([]);

  useEffect(async () => {
    const allMatches = await fetchRoundsData();
    const matchResults = computeMatchResults(allMatches);
    const rankClubs = sortRankForEachClub(matchResults);

    console.log(matchResults);
    setClubs(rankClubs);
  }, []);

  return (
    <div className="container">
      <h2>Premier League 2017/18</h2>

      <table className="table">
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
          {clubs.map((club, i) => (
            <tr key={club.name}>
              <td>{i + 1}</td>
              <td className="text-start">{club.name}</td>
              <td>{club.played}</td>
              <td>{club.won}</td>
              <td>{club.drawn}</td>
              <td>{club.lost}</td>
              <td>{club.gf}</td>
              <td>{club.ga}</td>
              <td>{club.gd}</td>
              <td>{club.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ClassTeam;
