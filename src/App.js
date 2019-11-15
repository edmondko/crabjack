import React from "react";
import "./App.css";
import SplashScreen from "./SplashScreen";
import Game from "./Game";
import ScoreBoard from "./ScoreBoard";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rulesShown: false,
      gameStarted: false,
      score: {
        gamesPlayed: 0,
        dealerPoints: 0,
        playerPoints: 0
      }
    };

    this.startGame = this.startGame.bind(this);
    this.endGame = this.endGame.bind(this);
    this.updateScore = this.updateScore.bind(this);
  }

  startGame() {
    this.setState({ gameStarted: true });
  }

  endGame() {
    this.setState({ gameStarted: false });
  }

  updateScore(result) {
    switch (result) {
      case "win":
        this.setState(state => {
          state.score.playerPoints += 1;
          state.score.gamesPlayed += 1;
        });
        break;
      case "bust":
        this.setState(state => {
          state.score.dealerPoints += 1;
          state.score.gamesPlayed += 1;
        });
        break;
      case "draw":
        this.setState(state => {
          state.score.playerPoints += 1;
          state.score.dealerPoints += 1;
          state.score.gamesPlayed += 1;
        });
        break;
      default:
        this.setState(state => {
          state.score.gamesPlayed = state.score.gamesPlayed + 1;
        });
        break;
    }
  }

  render() {
    return (
      <div className="App d-flex flex-column justify-content-center align-items-center">
        {!this.state.gameStarted ? (
          <div>
            <SplashScreen startGame={this.startGame} />
            <ScoreBoard {...this.state.score} />
          </div>
        ) : (
          <Game endGame={this.endGame} updateScore={this.updateScore} />
        )}
      </div>
    );
  }
}

export default App;
