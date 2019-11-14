import React from "react";
import axios from "axios";
import "./Game.css";
import CardBackground from "./Helpers";
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

    this.drawCard = this.drawCard.bind(this);
    this.calcPlayerScore = this.calcPlayerScore.bind(this);
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
          return (index % 2 === 0);
        });
        let playersCards = dealtCards.filter((elem, index) => {
          return (index % 2 !== 0);
        });
        console.log(dealersCards);
        console.log(playersCards);

        this.setState(
          {
            dealersHand: {
              cards: dealersCards,
              score: this.state.dealersHand.score
            },
            playersHand: {
              cards: playersCards,
              score: this.state.playersHand.score
            }
          },
          () => {
            console.log(this.state);
          }
        );
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

    this.setState(state => {
      state[currentPlayer].score = playerScore;
    });
  }

  checkWinner() {
    this.calcPlayerScore("playersHand");
    this.calcPlayerScore("dealersHand");

    if (this.state.playersHand.score > 21) {
      this.setState({ gameResult: "Bust" });
      return;
    }

    if (
      (this.state.playersHand.score > 21 &&
        this.state.dealersHand.score > 21) ||
      this.state.playersHand.score === this.state.dealersHand.score
    ) {
      this.setState({ gameResult: "Draw" });
      return;
    }

    if (
      this.state.playersHand.score > 21 ||
      this.state.dealersHand.score <= 21
    ) {
      this.setState({ gameResult: "Dealer wins!" });
      return;
    }
    if (
      this.state.dealersHand.score > 21 ||
      this.state.dealersHand.score <= 21
    ) {
      this.setState({ gameResult: "You win!" });
    }
  }

  handleReveal() {
    this.setState({
      cardsRevealed: true
    });
    this.checkWinner();
  }

  render() {
    return (
      <div
        className={
          "Game-container d-flex flex-column justify-content-between p-3 p-md-4 p-lg-5"
        }
      >
        <div className="dealerHand row justify-content-center">
          {this.state.dealersHand.cards.length > 0 ?
            this.state.dealersHand.cards.map(card => (
              <div className={"col-4 px-1"} key={`dealers_card_${card.code}`}>
                {!this.state.cardsRevealed ? (
                  <CardBackground />
                ) : (
                  <img className="w-100" src={card.image} alt={card.code} />
                )}
              </div>
            )): null}
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
        <div className="playerHand row justify-content-center">
          {this.state.playersHand.cards.length > 0 ?
            this.state.playersHand.cards.map(card => (
              <div
                className={"col-4 px-1"}
                key={`players_card_${card.code}`}
              >
                <img className="w-100" src={card.image} alt={card.code} />
              </div>
            )) : null
            }
        </div>
        {this.state.cardsRevealed ? (
          <div className="position-fixed Game-result d-flex justify-content-center align-items-cener flex-column">
            <div className="row no-gutters m-0 p-0">
              <div className="col-10 col-md-6 mx-auto">
                <div className="card shadow p-3">
                  <h2>{this.state.gameResult}</h2>
                  <p>Dealers score : {this.state.dealersHand.score}</p>
                  <p>Your score : {this.state.playersHand.score}</p>
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
        ) : null}
      </div>
    );
  }
}

export default Game;
