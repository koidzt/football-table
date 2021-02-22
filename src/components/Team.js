export default class Team {
  name = '';
  played = 0;
  won = 0;
  drawn = 0;
  lost = 0;
  point = 0;

  constructor(nameTeam) {
    this.name = nameTeam;
  }

  addPlayed() {
    this.played += 1;
  }

  updatedMatchResults(result) {
    switch (result) {
      case 'won':
        this.won += 1;
        this.point += 3;
        break;
      case 'lost':
        this.lost += 1;
        break;
      case 'drawn':
        this.drawn += 1;
        this.point += 1;
        break;
      default:
        break;
    }
  }
}
