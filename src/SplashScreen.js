import React from "react";
import Rules from "./Rules";

class SplashScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rulesShown: false
    };

    this.handleGameStart = this.handleGameStart.bind(this);
  }

  toggleRules() {
    this.setState({ rulesShown: !this.state.rulesShown });
  }

  handleGameStart() {
    this.props.startGame();
  }

  render() {
    return (
      <div className="SplashScreen">
        <div>
          <h1 className="display-5 text-white text-shadow mb-5">
            CrapJack
          </h1>
          <div className="btn-group">
            <button
              className={"btn btn-lg btn-success"}
              onClick={this.handleGameStart}
            >
              Start game
            </button>
            <button
              className={"btn btn-lg btn-secondary"}
              onClick={() => this.toggleRules(!this.state.rulesShown)}
            >
              {this.state.rulesShown ? 'Hide': 'View'} rules
            </button>
          </div>
          <div>{this.state.rulesShown ? <Rules /> : null}</div>
        </div>
      </div>
    );
  }
}

export default SplashScreen;
