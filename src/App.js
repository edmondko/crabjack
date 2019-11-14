import React from "react";
import "./App.css";
import SplashScreen from "./SplashScreen";
import Game from "./Game";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rulesShown: false,
      gameStarted: false
    };
    this.startGame = this.startGame.bind(this);
  }

  startGame() {
    this.setState({ gameStarted: true });
  }

  render() {
    return (
      <div className="App d-flex flex-column justify-content-center align-items-center">
        {!this.state.gameStarted ? (
          <SplashScreen startGame={this.startGame} />
        ) : (
          <Game />
        )}
      </div>
    );
  }
}

export default App;
