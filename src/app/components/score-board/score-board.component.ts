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
  playNameEmpty = false;
  playNameDuplicate = false;
  highestScoreName = 'Me';
  scoreDB = window.localStorage;
  MAX_SCORE_SIZE = 4;
  constructor() { }

  ngOnInit(): void {

    if(this.scoreDB && this.scoreDB.getItem('score')){
      this.players = JSON.parse(this.scoreDB.getItem('score'));
    }
    
    /*
    this.players.push({playerName: 'Mike', playerScores: [20, 30, 50],  roundScore: 0, totalScore: 0});
    this.players.push({playerName: 'Jony', playerScores: [20, 30, 50],  roundScore: 0, totalScore: 0});
    this.players.push({playerName: 'Jack', playerScores: [20, 30, 50],  roundScore: 0, totalScore: 0});
    */
  }

  addPlayer(){
    // validate name
    this.playNameDuplicate = this.players.map(p => p.playerName).includes(this.newPlayerName);
    this.playNameEmpty = this.newPlayerName === '';


    if (!this.playNameEmpty && !this.playNameDuplicate){
      this.players.push({playerName: this.newPlayerName, playerScores: [],  roundScore: undefined, totalScore: 0, rank: 0, hideHistory: false});
      this.newPlayerName = '';
    }
    this.savePlayerScores();

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

      p.hideHistory = p.playerScores.length > this.MAX_SCORE_SIZE;

    });

    this.sortPlayers();
    this.doubleScore = 1;
    this.savePlayerScores();
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

    for (let i = 0; i < this.players.length; i++){
      this.players[i].rank = i;
    }
  }

  // tslint:disable-next-line: typedef
  timesTwo(){
    this.doubleScore = this.doubleScore * 2;
  }
  
  restScores(){
    const r = confirm('Remove all score history?');
    if (r){
      this.players.forEach( p => {
        p.playerScores = [];
        p.totalScore = 0;
        p.hideHistory = false;
      });
      this.savePlayerScores();
      
    }
  }

  savePlayerScores(){
    if(this.scoreDB){
      this.scoreDB.setItem('score', JSON.stringify(this.players));
    } 
  }

  undoLastScores() {
    if (confirm('Remove last scores for all players?')){
      this.players.forEach(p => {
          if (p.playerScores.length > 0) {
            console.log(p.playerScores);
            p.playerScores = p.playerScores.slice(0, -1);
            p.totalScore = this.getPlayerTotalScore(p);
            console.log(p.playerScores);
          }
          p.hideHistory = p.playerScores.length > this.MAX_SCORE_SIZE;
      });
      this.sortPlayers();
      this.savePlayerScores();
    }
  }

  focusText(p){
    document.getElementById(p).focus();
    
  }

  removePlayer(delPlayer:Player){
    if (confirm('Remove this player?')){
      this.players = this.players.filter(p=>p.playerName != delPlayer.playerName);
      this.sortPlayers();
      this.savePlayerScores();
    }
  }

  toggleShowHideScores(p:Player){
    p.hideHistory = !p.hideHistory;
  }


}
