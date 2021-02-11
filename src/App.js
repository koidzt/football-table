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
        console.log('Clunb =>', resClubs);
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
            console.log('Rounds =>', jsonResponse.rounds);
            return jsonResponse.rounds;
          })
          .then((resRounds) => {
            const newClubs = [...resClubs];
            for (let i = 0; i < resRounds.length; i++) {
              for (let j = 0; j < resRounds[i].matches.length; j++) {
                if (resRounds[i].matches[j].score.ft[0] > resRounds[i].matches[j].score.ft[1]) {
                  const indClubWon = newClubs.findIndex((club) => club.name === resRounds[i].matches[j].team1);
                  newClubs[indClubWon] = {
                    code: newClubs[indClubWon].code,
                    country: newClubs[indClubWon].country,
                    drawn: newClubs[indClubWon].drawn,
                    lost: newClubs[indClubWon].lost,
                    name: newClubs[indClubWon].name,
                    played: newClubs[indClubWon].played + 1,
                    point: newClubs[indClubWon].point + 3,
                    won: newClubs[indClubWon].won + 1,
                  };

                  const indClubLost = newClubs.findIndex((club) => club.name === resRounds[i].matches[j].team2);
                  newClubs[indClubLost] = {
                    code: newClubs[indClubLost].code,
                    country: newClubs[indClubLost].country,
                    drawn: newClubs[indClubLost].drawn,
                    lost: newClubs[indClubLost].lost + 1,
                    name: newClubs[indClubLost].name,
                    played: newClubs[indClubLost].played + 1,
                    point: newClubs[indClubLost].point,
                    won: newClubs[indClubLost].won,
                  };
                } else if (resRounds[i].matches[j].score.ft[0] < resRounds[i].matches[j].score.ft[1]) {
                  const indClubWon = newClubs.findIndex((club) => club.name === resRounds[i].matches[j].team2);
                  newClubs[indClubWon] = {
                    code: newClubs[indClubWon].code,
                    country: newClubs[indClubWon].country,
                    drawn: newClubs[indClubWon].drawn,
                    lost: newClubs[indClubWon].lost,
                    name: newClubs[indClubWon].name,
                    played: newClubs[indClubWon].played + 1,
                    point: newClubs[indClubWon].point + 3,
                    won: newClubs[indClubWon].won + 1,
                  };

                  const indClubLost = newClubs.findIndex((club) => club.name === resRounds[i].matches[j].team1);
                  newClubs[indClubLost] = {
                    code: newClubs[indClubLost].code,
                    country: newClubs[indClubLost].country,
                    drawn: newClubs[indClubLost].drawn,
                    lost: newClubs[indClubLost].lost + 1,
                    name: newClubs[indClubLost].name,
                    played: newClubs[indClubLost].played + 1,
                    point: newClubs[indClubLost].point,
                    won: newClubs[indClubLost].won,
                  };
                } else {
                  const indClubTeam1 = newClubs.findIndex((club) => club.name === resRounds[i].matches[j].team1);
                  newClubs[indClubTeam1] = {
                    code: newClubs[indClubTeam1].code,
                    country: newClubs[indClubTeam1].country,
                    drawn: newClubs[indClubTeam1].drawn + 1,
                    lost: newClubs[indClubTeam1].lost,
                    name: newClubs[indClubTeam1].name,
                    played: newClubs[indClubTeam1].played + 1,
                    point: newClubs[indClubTeam1].point + 1,
                    won: newClubs[indClubTeam1].won,
                  };

                  const indClubTeam2 = newClubs.findIndex((club) => club.name === resRounds[i].matches[j].team2);
                  newClubs[indClubTeam2] = {
                    code: newClubs[indClubTeam2].code,
                    country: newClubs[indClubTeam2].country,
                    drawn: newClubs[indClubTeam2].drawn + 1,
                    lost: newClubs[indClubTeam2].lost,
                    name: newClubs[indClubTeam2].name,
                    played: newClubs[indClubTeam2].played + 1,
                    point: newClubs[indClubTeam2].point + 1,
                    won: newClubs[indClubTeam2].won,
                  };
                }
                setClubs(newClubs);
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
              <th>Club</th>
              <th>Played</th>
              <th>Won</th>
              <th>Drawn</th>
              <th>Lost</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {clubs.map((club) => (
              <tr>
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
