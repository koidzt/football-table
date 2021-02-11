import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [clubs, setClubs] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [isShow, setIsShow] = useState(false);

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
      .then((dataClubs) => {
        // console.log('Clubs =>', dataClubs);
        let newClubs = [];
        for (let i = 0; i < dataClubs.length; i++) {
          const newClub = {
            ...dataClubs[i],
            played: 0,
            won: 0,
            drawn: 0,
            lost: 0,
            point: 0,
          };
          newClubs.push(newClub);
        }
        return newClubs;
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
            const newClubs = [...resClubs];
            for (let i = 0; i < resRounds.length; i++) {
              for (let j = 0; j < resRounds[i].matches.length; j++) {
                if (resRounds[i].matches[j].score.ft[0] > resRounds[i].matches[j].score.ft[1]) {
                  const indClubWon = newClubs.findIndex((club) => club.name === resRounds[i].matches[j].team1);
                  newClubs[indClubWon] = {
                    ...newClubs[indClubWon],
                    played: newClubs[indClubWon].played + 1,
                    point: newClubs[indClubWon].point + 3,
                    won: newClubs[indClubWon].won + 1,
                  };

                  const indClubLost = newClubs.findIndex((club) => club.name === resRounds[i].matches[j].team2);
                  newClubs[indClubLost] = {
                    ...newClubs[indClubLost],
                    lost: newClubs[indClubLost].lost + 1,
                    played: newClubs[indClubLost].played + 1,
                  };
                } else if (resRounds[i].matches[j].score.ft[0] < resRounds[i].matches[j].score.ft[1]) {
                  const indClubWon = newClubs.findIndex((club) => club.name === resRounds[i].matches[j].team2);
                  newClubs[indClubWon] = {
                    ...newClubs[indClubWon],
                    played: newClubs[indClubWon].played + 1,
                    point: newClubs[indClubWon].point + 3,
                    won: newClubs[indClubWon].won + 1,
                  };

                  const indClubLost = newClubs.findIndex((club) => club.name === resRounds[i].matches[j].team1);
                  newClubs[indClubLost] = {
                    ...newClubs[indClubLost],
                    lost: newClubs[indClubLost].lost + 1,
                    played: newClubs[indClubLost].played + 1,
                  };
                } else {
                  const indClubTeam1 = newClubs.findIndex((club) => club.name === resRounds[i].matches[j].team1);
                  newClubs[indClubTeam1] = {
                    ...newClubs[indClubTeam1],
                    drawn: newClubs[indClubTeam1].drawn + 1,
                    played: newClubs[indClubTeam1].played + 1,
                    point: newClubs[indClubTeam1].point + 1,
                  };

                  const indClubTeam2 = newClubs.findIndex((club) => club.name === resRounds[i].matches[j].team2);
                  newClubs[indClubTeam2] = {
                    ...newClubs[indClubTeam2],
                    drawn: newClubs[indClubTeam2].drawn + 1,
                    played: newClubs[indClubTeam2].played + 1,
                    point: newClubs[indClubTeam2].point + 1,
                  };
                }
                setClubs(newClubs.sort((a, b) => b.point - a.point));
              }
            }
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
    </div>
  );
}

export default App;
