import React from 'react';

function ScoreBoard(props) {
  return (
    <div className={"score-board card mt-3"}>
      <div className="card-header">
        <h5 className="card-heading mb-0">ScoreBoard</h5>
      </div>
      <div className="card-body">
        <p>
          Games played: <strong>{props.gamesPlayed}</strong>
        </p>
        <div className="row">
          <div className="col-6">
            <p>
              Player: <strong>{props.playerPoints}</strong>
            </p>
          </div>
          <div className="col-6">
            <p>
              Dealer: <strong>{props.dealerPoints}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScoreBoard;