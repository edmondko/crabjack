import React from "react";
import axios from "axios";
import "./Game.css";
import { Card } from "./Card";
const apiUrl = "https://deckofcardsapi.com/api/deck";

export class Game extends React.Component {
  constructor(props) {
    super(props);
    this.placeholderItems = 3;
    this.emptyHand = { cards: [], score: 0 };

    this.initialState = {
      deck: {},
      dealersHand: this.emptyHand,
      playersHand: this.emptyHand,
      cardsRevealed: false,
      gameResult: ""
    };

    this.state = this.initialState;

    this.showGameResult = this.showGameResult.bind(this);
    this.handleDeal = this.handleDeal.bind(this);
    this.handleReveal = this.handleReveal.bind(this);
  }

  componentDidMount() {
    this.handleDeal();
  }

  drawCard(currentPlayer) {
    const drawApi = `${apiUrl}/${this.state.deck.deck_id}/draw/?count=1`;
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
          }
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

  calcPlayerScore(currentPlayer) {
    const specialCards = ["JACK", "QUEEN", "KING", "ACE"];
    let playerScore = 0;

    this.state[currentPlayer].cards.forEach(function(card, index) {
      const cardScore = specialCards.includes(card.value)
        ? 10
        : parseInt(card.value, 10);
      playerScore += cardScore;
    });

    this.setState(
      {
        [currentPlayer]: {
          cards: this.state[currentPlayer].cards,
          score: playerScore
        }
      },
      () => {
        this.checkWinner();
      }
    );
  }

  calcScore() {
    this.calcPlayerScore("dealersHand");
    this.calcPlayerScore("playersHand");
  }

  checkWinner() {
    const { dealersHand, playersHand } = this.state;

    if (
      playersHand.score > 21 ||
      (dealersHand.score <= 21 && dealersHand.score > playersHand.score)
    ) {
      this.setState({ gameResult: "Bust" });
      return;
    }

    if (playersHand.score === dealersHand.score) {
      this.setState({ gameResult: "Draw" });
      return;
    }

    if (
      playersHand.score <= 21 &&
      (playersHand.score >= dealersHand.score || dealersHand.score > 21)
    ) {
      this.setState({ gameResult: "You win!" });
      return;
    }
  }

  handleReveal() {
    this.calcScore();
    this.setState({
      cardsRevealed: true
    });
  }

  showGameResult() {
    return (
      <div className="position-fixed game-result d-flex justify-content-center align-items-cener flex-column">
        <div className="row no-gutters mb-5 animated fadeIn delay-1s">
          <div className="col-10 col-md-6 mx-auto">
            <div className="card shadow p-3">
              <h2>{this.state.gameResult ? this.state.gameResult : ""}</h2>
              <p>
                Dealers score: <strong>{this.state.dealersHand.score}</strong>
              </p>
              <p>
                Your score : <strong>{this.state.playersHand.score}</strong>
              </p>
              <button
                className={"btn btn-lg btn-success"}
                onClick={this.handleDeal}
              >
                Deal
              </button>
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
          <div className="row justify-content-center">
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

        <div className="btn-group my-3 my-xl-5 align-self-center">
          <button
            className={
              !this.state.cardsRevealed
                ? "btn btn-success"
                : "btn invisible disabled"
            }
            onClick={this.handleReveal}
          >
            Reveal
          </button>
        </div>
        <div className="player-hand d-flex flex-column flex-fill justify-content-end">
          <div className="row justify-content-center">
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
