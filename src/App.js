import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [clubs, setClubs] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [sumClubs, setSumClubs] = useState([]);

  useEffect(() => {
    fetch('/en.1.clubs.json', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((res) => {
        // console.log(res);
        return res.json();
      })
      .then((jsonResponse) => {
        // console.log(jsonResponse);
        return jsonResponse.clubs;
      })
      .then((resClubs) => {
        // console.log('Clunb =>', resClubs);
        fetch('/en.1.json', {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        })
          .then((res) => {
            // console.log(res);
            return res.json();
          })
          .then((jsonResponse) => {
            // console.log(jsonResponse);
            // console.log('Rounds =>', jsonResponse.rounds);
            return jsonResponse.rounds;
          })
          .then((resRounds) => {
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
                if (resRounds[i].matches[j].score.ft[0] > resRounds[i].matches[j].score.ft[1]) {
                  // Win
                  matchResults[resRounds[i].matches[j].team1] = {
                    ...matchResults[resRounds[i].matches[j].team1],
                    played: matchResults[resRounds[i].matches[j].team1].played + 1,
                    won: matchResults[resRounds[i].matches[j].team1].won + 1,
                    point: matchResults[resRounds[i].matches[j].team1].point + 3,
                  };

                  //Lost
                  matchResults[resRounds[i].matches[j].team2] = {
                    ...matchResults[resRounds[i].matches[j].team2],
                    played: matchResults[resRounds[i].matches[j].team2].played + 1,
                    lost: matchResults[resRounds[i].matches[j].team2].lost + 1,
                  };
                } else if (resRounds[i].matches[j].score.ft[0] < resRounds[i].matches[j].score.ft[1]) {
                  // Win
                  matchResults[resRounds[i].matches[j].team2] = {
                    ...matchResults[resRounds[i].matches[j].team2],
                    played: matchResults[resRounds[i].matches[j].team2].played + 1,
                    won: matchResults[resRounds[i].matches[j].team2].won + 1,
                    point: matchResults[resRounds[i].matches[j].team2].point + 3,
                  };

                  //Lost
                  matchResults[resRounds[i].matches[j].team1] = {
                    ...matchResults[resRounds[i].matches[j].team1],
                    played: matchResults[resRounds[i].matches[j].team1].played + 1,
                    lost: matchResults[resRounds[i].matches[j].team1].lost + 1,
                  };
                } else {
                  //Drawn
                  matchResults[resRounds[i].matches[j].team1] = {
                    ...matchResults[resRounds[i].matches[j].team1],
                    played: matchResults[resRounds[i].matches[j].team1].played + 1,
                    drawn: matchResults[resRounds[i].matches[j].team1].drawn + 1,
                    point: matchResults[resRounds[i].matches[j].team1].point + 1,
                  };

                  matchResults[resRounds[i].matches[j].team2] = {
                    ...matchResults[resRounds[i].matches[j].team2],
                    played: matchResults[resRounds[i].matches[j].team2].played + 1,
                    drawn: matchResults[resRounds[i].matches[j].team2].drawn + 1,
                    point: matchResults[resRounds[i].matches[j].team2].point + 1,
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
          });
      });
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
