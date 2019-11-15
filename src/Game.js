// This component is the Game itself

import React from "react";
import axios from "axios";
import "./Game.css";
import Card from "./Card";
import ScoreBoard from "./ScoreBoard";

const apiUrl = "https://deckofcardsapi.com/api/deck";

export class Game extends React.Component {
  constructor(props) {
    super(props);
    this.placeholderItems = 3;
    this.emptyHand = { cards: [], score: 0 };
    this.strings = {
      win: "win",
      bust: "bust",
      draw: "draw"
    };

    this.initialState = {
      deck: {},
      dealersHand: this.emptyHand,
      playersHand: this.emptyHand,
      cardsDealt: false,
      cardsRevealed: false,
      gameResultMessage: ""
    };

    this.state = this.initialState;

    this.handleDeal = this.handleDeal.bind(this);
    this.handleReveal = this.handleReveal.bind(this);
    this.showGameResult = this.showGameResult.bind(this);
    this.backToSplashScreen = this.backToSplashScreen.bind(this);
  }

  componentDidMount() {
    this.handleDeal();
  }

  drawCard(currentPlayer) {
    const drawApi = `${apiUrl}/${this.state.deck.deck_id}/draw/?count=2`;
    axios.get(drawApi).then(response => {
      if (this.state[currentPlayer].cards) {
        const currentPlayerHand = {
          cards: [...this.state[currentPlayer].cards, ...response.data.cards],
          score: this.state[currentPlayer].score
        };

        this.setState({
          [currentPlayer]: currentPlayerHand
        });
      }
    });
  }

  dealToPlayer(currentPlayer, card) {
    if (this.state[currentPlayer].cards) {
      this.setState(state => {
        state[currentPlayer].cards = [...state[currentPlayer].cards, card];
      });
    }
  }

  dealCards() {
    const drawApi = `${apiUrl}/${this.state.deck.deck_id}/draw/?count=6`;
    axios.get(drawApi).then(response => {
      if (response.data.success) {
        const dealtCards = response.data.cards;
        let dealersCards = dealtCards.filter((elem, index) => {
          return index % 2 === 0;
        });
        let playersCards = dealtCards.filter((elem, index) => {
          return index % 2 !== 0;
        });

        this.setState({
          dealersHand: {
            cards: dealersCards,
            score: this.state.dealersHand.score
          },
          playersHand: {
            cards: playersCards,
            score: this.state.playersHand.score
          },
          cardsDealt: true
        });
      }
    });
  }

  handleDeal() {
    if (this.state.cardsRevealed) {
      this.clearGame();
    }
    const initDeckApi = `${apiUrl}/new/shuffle/?deck_count=1`;
    axios.get(initDeckApi).then(response => {
      this.setState(
        {
          deck: response.data
        },
        () => {
          this.dealCards();
        }
      );
    });
  }

  clearGame() {
    this.setState(this.initialState);
  }

  calcPlayerScore(playersList) {
    const specialCards = ["JACK", "QUEEN", "KING", "ACE"];

    const scores = playersList.map(currentPlayer => {
      let scoreResult = 0;
      this.state[currentPlayer].cards.forEach((card, index) => {
        const cardScore = specialCards.includes(card.value)
          ? 10
          : parseInt(card.value, 10);
        scoreResult += cardScore;
      });
      return scoreResult;
    });

    this.setState(
      state => {
        state[playersList[0]].score = scores[0];
        state[playersList[1]].score = scores[1];
      },
      () => {
        this.checkWinner();
      }
    );
  }

  calcScore() {
    this.calcPlayerScore(["dealersHand", "playersHand"]);
  }

  checkWinner() {
    const { dealersHand, playersHand } = this.state;

    if (
      playersHand.score > 21 ||
      (dealersHand.score <= 21 && dealersHand.score > playersHand.score)
    ) {
      this.setState({
        gameResultMessage: this.strings.bust
      });
      this.props.updateScore(this.strings.bust);
      return;
    }

    if (playersHand.score === dealersHand.score) {
      this.setState({
        gameResultMessage: this.strings.draw
      });
      this.props.updateScore(this.strings.draw);
      return;
    }

    if (
      playersHand.score <= 21 &&
      (playersHand.score >= dealersHand.score || dealersHand.score > 21)
    ) {
      this.setState({
        gameResultMessage: this.strings.win
      });
      this.props.updateScore(this.strings.win);
      return;
    }
  }

  handleReveal() {
    this.calcScore();
    this.setState({
      cardsRevealed: true
    });
  }

  backToSplashScreen() {
    this.props.endGame();
  }

  showGameResult() {
    const { gameResultMessage, dealersHand, playersHand } = this.state;
    const getResulStyles = () => {
      let titleStyling = "text-capitalize text-white rounded p-1 shadow-sm";
      if (gameResultMessage === this.strings.win) {
        titleStyling += " bg-success";
      }
      if (gameResultMessage === this.strings.draw) {
        titleStyling += " bg-warning";
      }
      if (gameResultMessage === this.strings.bust) {
        titleStyling += " bg-danger";
      }
      return titleStyling;
    };

    const resultMessageStyles = getResulStyles();

    return (
      <div className="position-fixed popup-overlay d-flex justify-content-center align-items-cener flex-column">
        <div className="row no-gutters mb-5 animated fadeIn delay-1s">
          <div className="col-10 col-md-6 mx-auto">
            <div className="card shadow p-3">
              <h2 className={resultMessageStyles}>{gameResultMessage} </h2>
              <div className="row mb-3">
                <div className="col-6">
                  Your Hand : <strong>{playersHand.score}</strong>
                </div>
                <div className="col-6">
                  Dealers Hand: <strong>{dealersHand.score}</strong>
                </div>
              </div>
              <ScoreBoard {...this.props.gameScore} />
              <div className="btn-group btn-group-justified mt-3">
                <button className={"btn btn-success"} onClick={this.handleDeal}>
                  Deal again
                </button>
                <button
                  className={"btn btn-danger"}
                  onClick={this.backToSplashScreen}
                >
                  Main Menu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div
        className={
          "game-container w-100 h-100 d-flex flex-column justify-content-between"
        }
      >
        <div className="dealer-hand d-flex flex-column flex-fill justify-content-start ">
          <h2 className={"text-white"}>Dealer's hand</h2>
          <div className="row justify-content-center px-3">
            {this.state.dealersHand.cards.length > 0
              ? this.state.dealersHand.cards.map((card, index) => (
                  <div
                    className={`col-4 py-3 overflow-hidden`}
                    key={`dealers_card_${card.code}`}
                  >
                    <Card
                      imageSrc={card.image}
                      alt={card.code}
                      revealed={this.state.cardsRevealed}
                    />
                  </div>
                ))
              : null}
          </div>
        </div>
        {this.state.cardsDealt && !this.state.cardsRevealed ? (
          <div className="my-3 my-xl-5 align-self-center animated delay-1s fadeIn">
            <button
              className={"btn btn-lg btn-success"}
              onClick={this.handleReveal}
            >
              Reveal
            </button>
          </div>
        ) : null}
        <div className="player-hand d-flex flex-column flex-fill justify-content-end">
          <div className="row justify-content-center px-3">
            {this.state.playersHand.cards.length > 0
              ? this.state.playersHand.cards.map((card, index) => (
                  <div
                    className={`col-4 py-3 overflow-hidden`}
                    key={`players_card_${card.code}`}
                  >
                    <Card
                      imageSrc={card.image}
                      alt={card.code}
                      revealed={true}
                    />
                  </div>
                ))
              : null}
          </div>
          <h2 className={"text-white"}>Your hand</h2>
        </div>
        {this.state.cardsRevealed ? this.showGameResult() : null}
      </div>
    );
  }
}

export default Game;
