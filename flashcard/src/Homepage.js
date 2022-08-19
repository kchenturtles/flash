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
    const [definitionPopUp, setDefinitionPopUp] = useState(false);
    const [definitionsArray, setDefinitionsArray] = useState([]);

   useEffect(() => {
      // localStorage.clear();
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
            let defString = t[1];
            console.log(defString);
            if(defString.includes(',')) {
               const defs = defString.split(',');
               console.log(defs);
               var newString = "";
               defs.map((def) => {
                  newString += def.trim();
                  newString += "\n";
                  console.log(newString);
               });
               defString = newString;
               console.log(defString);
               console.log('Hey');
            } 
            let c = new Card(t[0], defString);
             console.log(c);
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
            setDefinitionPopUp(true);
          }
        }
    }

    async function getDefinition(term) {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${term}`);
        if(response.status == "404") {
          console.log("uh-oh");
          alert("Not a valid term");
          setDefinitionPopUp(false);
        }
        else if(response.ok) {
          const json = await response.json();
          console.log(json[0].meanings[0].definitions[0].definition);
          const definition = json[0].meanings[0].definitions[0].definition;
            let c = new Card(term, JSON.stringify(definition));
              let newArray = cardArray;
              newArray.push(c);
              setCardArray(newArray);
              setNumCards(numCards + 1);
              localStorage.setItem(c.term, c.definition);
              console.log(localStorage.getItem(c.term));
          console.log(JSON.stringify(json));
          var newA = definitionsArray;
          newA = [];
          setDefinitionsArray(newA);
          for(var key of Object.keys(json)) {
            json[key].meanings.forEach((meaning) => {
              meaning.definitions.forEach((def) => {
                console.log(def);
                newA.push(def.definition);
                setDefinitionsArray(newA);
              });
            });
          }
          console.log(definitionsArray);
         
          return definition;
          
        } else {
          alert("Something went wrong, please try again");
          setDefinitionPopUp(false);
        }
    }

    function DefinitionCheckList() {
      return (
        <div className = "definitions">
        <ul>
         {definitionsArray.map((definition) => <li><input type="checkbox" />{definition}</li>)}
        </ul>
        </div>
       );
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
      } else {
        if(cardArray[cardNumber].definition.includes("\n")) {
          var definitions = cardArray[cardNumber].definition.split("\n");
         definitions = definitions.filter((def) => def != ' ' && def != '');
          console.log(definitions);
          return(<div className = "definition">
            <ol>
              {definitions.map((def) => <li>{def}</li>)}
            </ol>
          </div>);
        }
       return <div className = "definition">{cardArray[cardNumber].definition}
         </div>;
      }
    }

    if(definitionPopUp) {
      return(
        <div id = "App" className = "definitionsList">
            <h2>Select Definition...</h2>
            <DefinitionCheckList />
            <button onClick = {() => {setDefinitionPopUp(false)}}> Close Definitions List</button>
        </div>
      );
    } else {
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
              flipCard(true);
          } else {
            changeCard(cardNumber + 1);
            flipCard(true);
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
    }

   

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