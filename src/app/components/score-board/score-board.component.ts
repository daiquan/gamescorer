import { Component, OnInit } from '@angular/core';
import {Player} from '../../models/Player';

@Component({
  selector: 'app-score-board',
  templateUrl: './score-board.component.html',
  styleUrls: ['./score-board.component.css']
})
export class ScoreBoardComponent implements OnInit {
  newPlayerName = '';
  players: Player[] = [];
  doubleScore = 1;
  playNameOk = true;
  highestScoreName = 'Me';

  constructor() { }

  ngOnInit(): void {
    
    this.players.push({playerName: 'Me', playerScores: [],  roundScore: undefined, totalScore: 0, rank: 0});
    /*
    this.players.push({playerName: 'Mike', playerScores: [20, 30, 50],  roundScore: 0, totalScore: 0});
    this.players.push({playerName: 'Jony', playerScores: [20, 30, 50],  roundScore: 0, totalScore: 0});
    this.players.push({playerName: 'Jack', playerScores: [20, 30, 50],  roundScore: 0, totalScore: 0});
    */
  }

  addPlayer(){
    if (this.newPlayerName === ''){
      this.playNameOk = false;
    }
    else{
      this.playNameOk = true;

    }


    if (this.playNameOk){
      this.players.push({playerName: this.newPlayerName, playerScores: [],  roundScore: undefined, totalScore: 0, rank: 0});
      this.newPlayerName = '';
    }

  }

  getPlayerTotalScore(p: Player): number {
    return p.playerScores.reduce((sum, curr) => (sum + curr), 0);
  }

  addRound(){
    this.players.forEach((p) => {
      
      if (p.roundScore === undefined) {
        p.roundScore = 0;
      }
      p.playerScores.push(p.roundScore * this.doubleScore);
      p.roundScore = undefined;
      p.totalScore = this.getPlayerTotalScore(p);
    });

    this.sortPlayers();
    this.doubleScore = 1;
  }
  sortPlayers() {
    this.players.sort((a, b) => {
      if (a.totalScore >= b.totalScore){
        return -1;
      }
      else{
        return 1;
      }

  });

  for(let i = 0; i < this.players.length; i++){
    this.players[i].rank = i;
  }
  }

  timesTwo(){
    this.doubleScore = this.doubleScore * 2;
  }

  restScores(){
    const r = confirm('Remove all score history?');
    if (r){
      this.players.forEach( p => {
        p.playerScores = [];
        p.totalScore = 0;
      });
    }
  }

  undoLastScores() {
    if (confirm('Remove last scores for all players?')){
      this.players.forEach(p => {
          if (p.playerScores.length > 0) {
            console.log(p.playerScores);
            p.playerScores = p.playerScores.slice(0,-1);
            p.totalScore = this.getPlayerTotalScore(p);
            console.log(p.playerScores);
          }
      });
      this.sortPlayers();
    }

  }

}
