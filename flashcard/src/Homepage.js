import logo from './logo.svg';
import './App.css';
import { useEffect, useState, ChangeEvent, FormEvent} from 'react';

 class Card {
    constructor(term, definition) {
        this.term = term;
        this.definition = definition;
    }

    getTerm() {
      return this.term;
    }

    getDefinition() {
      return this.definition;
    }
 }
 let array = new Array();
export function Homepage() {
    const [cardSide, flipCard] = useState(true);
    const [cardNumber, changeCard] = useState(0);
    const [cardArray, setCardArray] = useState(new Array(new Card("", "")));
    const [numCards, setNumCards] = useState(localStorage.length);

   useEffect(() => {
      var cards = new Array();
      console.log(localStorage.length);
      for(let i = 0; i < localStorage.length; i++) {
        const c = new Card(localStorage.key(i), localStorage.getItem(localStorage.key(i)));
        cards.push(c);
      }
        if(cards) {
            setCardArray(cards);
        }
   }, [cardNumber]);
   
    function addWord(event) {
      event.preventDefault();
        let text = document.querySelector('#name').value;
        if(text.includes('/')) {
            let t = text.split('/');
            let c = new Card(t[0], t[1]);
            let newArray = cardArray;
            newArray.push(c);
            console.log(newArray);
            setCardArray(newArray);
            setNumCards(numCards + 1);
            localStorage.setItem(c.term, c.definition);
        } else {
          let term = document.querySelector('#name').value;
          if(term) {
            const definition = async() => { const response = await getDefinition(term)};
            definition();
          }
          
          
        }
    }

    async function getDefinition(term) {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${term}`);
        if(response.status == "404") {
          console.log("uh-oh");
          alert("Not a valed");
        }
        if(response.ok) {
          const json = await response.json();
          console.log(json[0].meanings[1].definitions[0].definition);
          const definition = json[0].meanings[0].definitions[0].definition;
            let c = new Card(term, JSON.stringify(definition));
              let newArray = cardArray;
              newArray.push(c);
              setCardArray(newArray);
              setNumCards(numCards + 1);
              localStorage.setItem(c.term, c.definition);
              console.log(localStorage.getItem(c.term));
           return definition;
          
        } else {
          alert("Not a valid term");
        }
    }

    function Side() {
      if(cardSide) {
        return <div>term</div>;
      } else {
        return <div>definition</div>
      }
    }

    function Term() {
      console.log(cardArray);
      if(cardArray.length == 0) {
        return;
      } 
      if(cardSide) {
       return <div className = "term">{cardArray[cardNumber].term}</div>;
      //  return <p>asdf</p>
      } else {
       return <div className = "definition">{cardArray[cardNumber].definition}</div>;
      //  return <p>asdfasdf</p>
      }
    }

    return (
        <div id = "App">
            <div className="card center">
                <div id="num" className = "topper">{cardNumber + 1}/{numCards}</div>
                <div id = "id" className = "topper">
                  <Side />
                </div>
                <div id="term">
                  <Term />
                </div>
            </div>
        <button id = "flip" className="center" onClick = {() => {flipCard(!cardSide)}}>Flip Card</button>
        <button id="change" onClick = {() => 
         { if(cardNumber >= numCards-1) {
              changeCard(0);
          } else {
            changeCard(cardNumber + 1)
          }
        }
        }
          >Next Card</button>
        <div>
           <input id="file" type="text"></input>
           <button> Upload File Here</button>
        </div>
        <p>
        <form onSubmit={addWord}>
            <input id="name" placeholder = "Enter word or pairing" type="text"/>
            <input type="submit"/>
        </form>
        </p>
        </div>
     );

    // return (
    //     <div id = "App">
    //         <div className="card center">
    //             <div id="num" className = "topper">{cardNumber}/{cardNumber}</div>
    //             <div id = "id" className = "topper">
    //               <Side />
    //             </div>
    //             <p id="term" className = "term"></p>
    //         </div>
    //     <button id = "flip" className="center" onClick = {() => {flipCard(!cardSide)}}>Flip Card</button>
    //     <button id="change" onClick = {() => 
    //      { if(cardNumber == numCards) {
    //           changeCard(0);
    //       } else {
    //         changeCard(cardNumber + 1)
    //       }
    //     }
    //     }
    //       >Next Card</button>
    //     <div>
    //        <input id="file" type="text"></input>
    //        <button> Upload File Here</button>
    //     </div>
    //     <p>
    //     <form onsubmit={addWord}>
    //         <input id="name" placeholder = "Enter word or pairing" type="text"/>
    //         <input type="submit"/>
    //     </form>
    //     </p>
    //     </div>
    //  );
}