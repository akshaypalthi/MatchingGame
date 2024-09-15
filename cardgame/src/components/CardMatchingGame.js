import React, { useState, useEffect } from "react";
import "./CardMatchingGame.css";

const CardMatchingGame = () => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [timeTaken, setTimeTaken] = useState(null);
  const [bestScore, setBestScore] = useState(localStorage.getItem("bestScore") || null);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const cardNumbers = [...Array(8).keys(), ...Array(8).keys()].sort(() => Math.random() - 0.5); 
    setCards(cardNumbers.map((number, index) => ({ id: index, number, isFlipped: false })));
    setFlippedCards([]);
    setMatchedCards([]);
    setStartTime(Date.now());
    setTimeTaken(null);
  };

  const handleCardClick = (cardId) => {
    if (flippedCards.length === 2 || matchedCards.includes(cardId)) return; 

    const updatedCards = cards.map((card) =>
      card.id === cardId ? { ...card, isFlipped: true } : card
    );
    setCards(updatedCards);
    setFlippedCards((prevFlipped) => [...prevFlipped, cardId]);

    if (flippedCards.length === 1) {
      checkMatch(cardId, flippedCards[0]);
    }
  };

  const checkMatch = (cardId1, cardId2) => {
    const card1 = cards.find((card) => card.id === cardId1);
    const card2 = cards.find((card) => card.id === cardId2);

    if (card1.number === card2.number) {
      setMatchedCards((prevMatched) => [...prevMatched, cardId1, cardId2]);
      if (matchedCards.length + 2 === cards.length) {
        endGame();
      }
    } else {
      setTimeout(() => {
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.id === cardId1 || card.id === cardId2 ? { ...card, isFlipped: false } : card
          )
        );
      }, 1000);
    }
    setFlippedCards([]);
  };

  const endGame = () => {
    const endTime = Date.now();
    const timeTaken = ((endTime - startTime) / 1000).toFixed(2);
    setTimeTaken(timeTaken);

    if (!bestScore || timeTaken < bestScore) {
      setBestScore(timeTaken);
      localStorage.setItem("bestScore", timeTaken);
    }
  };

  return (
    <div>
      <h1 id="level-title">Card Matching Game</h1>
      {timeTaken ? <h2 className="score">Your Time: {timeTaken}s</h2> : null}
      {bestScore ? <h2 className="score">Best Time: {bestScore}s</h2> : null}
      <div className="container">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`btn green ${matchedCards.includes(card.id) ? "game-over" : ""}`}
            onClick={() => handleCardClick(card.id)}
          >
            {card.isFlipped || matchedCards.includes(card.id) ? card.number : ""}
          </div>
        ))}
      </div>
      <button onClick={initializeGame}>Restart Game</button>
    </div>
  );
};

export default CardMatchingGame;
