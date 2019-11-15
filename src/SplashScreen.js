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
          <h1 className="display-5 text-white text-shadow mb-5">CrapJack</h1>
          <div className="actions">
            <button
              className={"btn btn-block btn-lg btn-success"}
              onClick={this.handleGameStart}
            >
              Start game
            </button>
            <button
              className={"btn btn-block btn-lg btn-warning"}
              onClick={() => this.toggleRules(!this.state.rulesShown)}
            >
              {this.state.rulesShown ? "Hide" : "Show"} Rules
            </button>
          </div>
          <div>
            {this.state.rulesShown ? (
              <div className="position-fixed popup-overlay d-flex justify-content-center align-items-cener flex-column">
                <div className="container">
                  <button
                    className={"btn btn-warning m-3"}
                    onClick={() => this.toggleRules(!this.state.rulesShown)}
                  >
                    Go back
                  </button>
                  <div className="card shadow p-3 animated fadeInUp rules-container">
                    <Rules />
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

export default SplashScreen;
