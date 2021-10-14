//import logo from './logo.svg';
import './App.css';
import { useState, useEffect} from "react";
import Cards from './Card';
//import Test from "./Test";

function App() {
  
  const[currentCard, setCurrentCard] = useState({});
  const [previousCard, setPreviousCard] = useState({})
  const [score, setScore] = useState(0);
  const[loading, setLoading] = useState(false);
  const[deck, setDeck] = useState();
  const [choice, setChoice] = useState("");
  const [ready, setReady] = useState(true);
  
  useEffect(() =>{
    async function getData(){
      setLoading(true);
      const res = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1");
      const data = await res.json();
      setDeck(data);
      setLoading(false);
    }
    getData();
  }, []);  

  useEffect(() => {
    if (ready) {
      getScore();
      setChoice("");
    }
  }, [previousCard, currentCard, ready, score, choice]);



  function getScore(){
    let currentCardValue = getValue(currentCard);
    let previousCardValue = getValue(previousCard);

    if (choice === "higher" && currentCardValue >= previousCardValue){
      setScore(score + 1);
    }
    else if (choice === "lower" && currentCardValue <= previousCardValue){
      setScore(score + 1);      
    }
    else {
      return;
    }
  }



  function getValue(card){
    let cardValue = 0;
    switch (card.value){
      case ("JACK") : cardValue = 11;
      break;
      case("QUEEN") : cardValue = 12;
      break;
      case("KING") : cardValue = 13;
      break;
      case("ACE") : cardValue = 14;
      break;
      default : cardValue = parseInt(card.value);
      break;
    }
    return cardValue;
  }

  function getCard(){
    async function fetchCard(){
      setReady(false);
      const res = await fetch(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=1`);
      const data = await res.json();
      console.log(data);
      setPreviousCard(currentCard);
      setCurrentCard(data.cards[0]);
      setReady(true);
    }
    fetchCard();
  }

  if (loading) return <div>loading...</div>
  if (!deck) return <div>Error ...</div>

  return (    
    <div>
    
    <h1>Deck ID: {deck.deck_id}</h1>

    <h1 style= {{textAlign: "center"}}>Score:  {score}</h1>

    <div className= "Container">
    <button onClick={() =>{
      getCard()
      setChoice("lower");
    }}
      > Lower </button> 
    <button onClick={() =>{
      getCard()
      setChoice("higher");
    }}
    > Higher </button> 
    <div>
    <h1>Current</h1>
    <Cards imageSrc={currentCard.image} imageAlt = {currentCard.suit} />
    </div>
    <div>
    <h1>Previous</h1>
    <Cards imageSrc={previousCard.image} imageAlt = {previousCard.suit} />
    </div>
    </div>

    </div>
  );
}

export default App;
