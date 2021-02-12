import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [clubs, setClubs] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [sumClubs, setSumClubs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let resClubs = await fetch('/en.1.clubs.json', {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      resClubs = await resClubs.json();
      resClubs = await resClubs.clubs;

      let resRounds = await fetch('/en.1.json', {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      resRounds = await resRounds.json();
      resRounds = await resRounds.rounds;

      let matchResults = {};
      for (let i = 0; i < resClubs.length; i++) {
        matchResults[resClubs[i].name] = {
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          point: 0,
        };
      }
      // console.log(matchResults);

      for (let i = 0; i < resRounds.length; i++) {
        for (let j = 0; j < resRounds[i].matches.length; j++) {
          if (resRounds[i].matches[j].score.ft[0] === resRounds[i].matches[j].score.ft[1]) {
            const drawnClubs = [resRounds[i].matches[j].team1, resRounds[i].matches[j].team2];
            for (let k = 0; k < 2; k++) {
              matchResults[drawnClubs[k]] = {
                ...matchResults[drawnClubs[k]],
                played: matchResults[drawnClubs[k]].played + 1,
                drawn: matchResults[drawnClubs[k]].drawn + 1,
                point: matchResults[drawnClubs[k]].point + 1,
              };
            }
          } else {
            const clubWin =
              resRounds[i].matches[j].score.ft[0] > resRounds[i].matches[j].score.ft[1]
                ? resRounds[i].matches[j].team1
                : resRounds[i].matches[j].team2;
            // Win
            matchResults[clubWin] = {
              ...matchResults[clubWin],
              played: matchResults[clubWin].played + 1,
              won: matchResults[clubWin].won + 1,
              point: matchResults[clubWin].point + 3,
            };

            const clubLost =
              resRounds[i].matches[j].score.ft[0] < resRounds[i].matches[j].score.ft[1]
                ? resRounds[i].matches[j].team1
                : resRounds[i].matches[j].team2;
            //Lost
            matchResults[clubLost] = {
              ...matchResults[clubLost],
              played: matchResults[clubLost].played + 1,
              lost: matchResults[clubLost].lost + 1,
            };
          }
        }
      }

      let newMatchResults = [];
      for (let key in matchResults) {
        newMatchResults.push({
          name: key,
          ...matchResults[key],
        });
      }
      newMatchResults = newMatchResults.sort((a, b) => b.point - a.point);
      // console.log(newMatchResults);
      setSumClubs(newMatchResults);
      setClubs(resClubs);
      setRounds(resRounds);
    };

    fetchData();
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
