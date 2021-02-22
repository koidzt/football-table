import { useEffect, useState } from 'react';
import Team from '../components/Team';
const _ = require('lodash');

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
  const reduceResRounds = resRounds.rounds.reduce((acc, round) => {
    acc = [...acc, ...round.matches];
    return acc;
  }, []);

  const sortRounds = reduceResRounds.sort((a, b) => a.date > b.date); // 2017-11-04 --> 2018-05-13
  // const sortRounds = reduceResRounds.sort((a, b) => (a.date > b.date ? -1 : 1)); //  2018-05-13 --> 2017-11-04

  return sortRounds;
};

// Updated Match Results
const updatedMatchResults = (resRounds) => {
  const computedData = resRounds.reduce((acc, match) => {
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

    return acc;
  }, {});

  return computedData;
};

//Sort Match Results By Points and Change Object to Array
const sortRankForEachClub = (matchResults) => {
  const sortPointsByDesc = _.sortBy(matchResults, 'point').reverse();
  return sortPointsByDesc;
};

function ClassTeam() {
  const [matches, setMatches] = useState([]);
  const [clubs, setClubs] = useState([]);

  useEffect(async () => {
    const fetchAllMatches = await fetchRoundsData();
    const matchResults = updatedMatchResults(fetchAllMatches);
    const rankClubs = sortRankForEachClub(matchResults);

    setMatches(fetchAllMatches);
    setClubs(rankClubs);
  }, []);

  return (
    <div className="container">
      <h2>Premier League 2017/18</h2>

      <table className="table">
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
          {clubs.map((club, i) => (
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
  );
}

export default ClassTeam;
