import React from "react";

function Rules() {
  return (
    <div className="Rules ">
        <h2>Rules</h2>
        <p>Single player vs Dealer</p>
        <p>Each player dealt 3 Cards</p>
        <p>Dealer Hand will be dealt Face Down</p>
        <p>Player hand dealt facing up</p>
        <br />
        <p>
          When the player clicks the Reveal button, the Dealer Hand will be
          shown, both hands scored, and a winner declared.
        </p>
        <h5>Scoring</h5>
        <p>Each card is scored as follows:</p>
        <p>2 =2, 3=3…. 10 = 10,</p>
        <p>Picture Cards J / Q / K / A = 10</p>
        <br />
        <p>A hand scoring over 21 = Bust</p>
        <p>
          The player with the hand closest to, but less than or equal to 21 wins
        </p>
      </div>
  );
}

export default Rules;
