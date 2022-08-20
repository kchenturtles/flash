import logo from './logo.svg';
import './App.css';
import { useEffect, useState, ChangeEvent, FormEvent} from 'react';

 class Card {
    constructor(term, definition) {
        this.term = term;
        this.definition = definition;
    }
 }
export function Homepage() {
    const [cardSide, flipCard] = useState(true);
    const [cardNumber, changeCard] = useState(0);
    const [cardArray, setCardArray] = useState(new Array(new Card("", "")));
    const [numCards, setNumCards] = useState(localStorage.length);
    const [definitionPopUp, setDefinitionPopUp] = useState(false);
    const [definitionsArray, setDefinitionsArray] = useState([]);
    var definitionPopUpDefinition = "";
    const [currentTerm, setCurrentTerm] = useState("");

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
            } 
            let c = new Card(t[0], defString);
             console.log(c);
            if(alreadyStored(c.term)) {
              alert("Your set already contains this term! Edit the definition or delete it.");
            } else {
              let newArray = cardArray;
             newArray.push(c);
            console.log(newArray);
            setCardArray(newArray);
            setNumCards(numCards + 1);
              localStorage.setItem(c.term, c.definition);
              alert("New Flashcard Created!");
              document.querySelector('#name').value = "";
            }
        } else {
          let term = document.querySelector('#name').value;
          if(term) {
            const definition = async() => { const response = await getDefinition(term)};
            definition();
            setCurrentTerm(term);
            setDefinitionPopUp(true);
          }
        }
    }

    function alreadyStored(k) {
      console.log(localStorage.getItem(k));
      if(localStorage.getItem(k) != undefined || localStorage.getItem(k) != null) {
        return true;
      }
      return false;
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

    function handleCheck(event) {
      if(event.target.checked) {
        console.log("checked");
        console.log(event.target.parentElement.innerHTML);
        var parent = event.target.parentElement;
        var child = parent.querySelector('#this-definition');
        const definition = child.innerHTML.replace("\"", '');
        definitionPopUpDefinition += definition;
        definitionPopUpDefinition += "\n";
        console.log(definitionPopUpDefinition);
      } else {
        console.log("unchecked");
        var parent = event.target.parentElement;
        var child = parent.querySelector('#this-definition');
        const definition = child.innerHTML.replace("\"", '');
        definitionPopUpDefinition = definitionPopUpDefinition.replace(definition, '');
        console.log(definitionPopUpDefinition);
      }
    }

    function submitDefinition() {           
     if(alreadyStored(currentTerm)) {
      alert("Your set already contains this term! Edit the definition or delete it.");
     } else {
      var newArray = cardArray;
      newArray.push(new Card(currentTerm, definitionPopUpDefinition));
      setNumCards(numCards + 1);
      setCardArray(newArray);
      localStorage.setItem(currentTerm, definitionPopUpDefinition);
      console.log(newArray);
      console.log(cardArray);
     }
      definitionPopUpDefinition = "";
      setCurrentTerm("");
      setDefinitionPopUp(false);
      alert("New Flashcard Created!");
    }

    function clearFlashcards() {
      if(window.confirm("Clear all flashcards? This action cannot be reversed.")) {
        localStorage.clear(); 
        window.location.reload();
      }
    }

    function deleteCard() {
      if(window.confirm("Delete this card? This action cannot be reversed.")) {
        const currentTerm = cardArray[cardNumber].term;
        console.log(currentTerm);
        const newArray = cardArray.filter((c) => c.term != currentTerm);
        console.log(newArray);
        setCardArray(newArray);
        console.log(cardArray);
        localStorage.removeItem(currentTerm);
        setNumCards(numCards - 1);
      }
    }

    function DefinitionCheckList() {
      return (
        <div className = "definitions">
        <ul>
         {definitionsArray.map((definition) => <li className = "definition-list-item"><input type="checkbox" onChange = {handleCheck}/><label id = "this-definition">{definition}</label></li>)}
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
       return <div className = "definition"><ol><li>{cardArray[cardNumber].definition}</li></ol>
         </div>;
      }
    }

    if(definitionPopUp) {
      return(
        <div id = "App" className = "definitionsList">
            <h2>Select Definition...</h2>
            <DefinitionCheckList />
            <button onClick = {submitDefinition}> Finish Definition Selection</button>
        </div>
      );
    } else {
      return (
        <div id = "App">
            <div className="card center" id = "card">
                <button onClick = {deleteCard}> Delete Card </button>
                <div id="num" className = "topper">{cardNumber + 1}/{numCards}</div>
                <div id = "id" className = "topper">
                  <Side />
                </div>
                <div id="term">
                  <Term />
                </div>
            </div>
        <div id = "leftmenu">
        <button id = "flip" onClick = {() => {flipCard(!cardSide)}}>Flip Card</button>
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
          <form onSubmit={addWord}>
            <input id="name" placeholder = "Enter word or pairing" type="text"/>
            <input type="submit"/>
        </form>
        <button onClick = {clearFlashcards}>Clear Flashcards</button>
        </div>
        <div id = "rightmenu">
           <input id="file" type="text"></input>
           <button> Upload File Here</button>
        </div>
        </div>
     );
    }
 
}