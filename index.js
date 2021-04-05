//jshint esversion:6
let suitsA = ["Triangle", "Circle"];
let valuesA = ["One", "Two", "Three", "Four", "Five", "Seven", "Eight", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen"];
let suitsB = ["Cross", "Square"];
let valuesB = ["One", "Two", "Three", "Five", "Seven", "Ten", "Eleven", "Thirteen", "Fourteen"];
let suitsC = ["Star"];
let valuesC = ["One", "Two", "Three", "Four", "Five", "Seven", "Eight"];
let suitsD = ["Whot"];
let valuesD = ["20", "20", "20", "20", "20"];

let startButton = document.getElementById("startButton");
let getDeckCardButton = document.getElementById("getCardFromDeck");
let textArea = document.getElementById("text");
let numberOfPlayers = document.getElementById("numberOfPlayers").value;
let startingCardDiv = document.getElementById("dropPoint");
let neededCardsDivforWhot = document.getElementById("neededCards");
let selectedCardForWhot = "";
let numberOfCardsShared = 4;
let startingCard = "";
let playedPlayerId = "";
let x = 0;
let y = 0;
let currentCard = {};
let previousCard = {};
let previousCardName = "";
let whotCard = "";


let gameStarted = false,
    gameEnded = false,
    deck = [],
    players = [],
    playedDeck = [];

getDeckCardButton.style.display = "none";
startButton.addEventListener("click", startGame);
neededCardsDivforWhot.style.display = "none";

function startGame() {

  textArea.innerText = "";
  gameStarted = true;
  gameOver = false;
  startButton.style.display = "none";
  getDeckCardButton.style.display = "block";
  getDeckCardButton.addEventListener("click", getCardFromDeck);
  createDeck();
  shuffleDeck();
  addPlayers();
  shareCards();
  generateCardsGraphics();
  setTurn();
  applyCardAbilitiesStartingCard();
}

function createDeck() {
  for (let i = 0; i < suitsA.length; i++) {
    for (let j = 0; j < valuesA.length; j++ ) {
      let card = {
        suit: suitsA[i],
        value: valuesA[j]
      };
    deck.push(card);
    }
  }
  for (let k = 0; k < suitsB.length; k++) {
    for (let l = 0; l < valuesB.length; l++ ) {
      let card2 = {
        suit: suitsB[k],
        value: valuesB[l]
      };
    deck.push(card2);
    }
  }
  for (let m = 0; m < suitsC.length; m++) {
    for (let n = 0; n < valuesC.length; n++ ) {
      let card3 = {
        suit: suitsC[m],
        value: valuesC[n]
      };
    deck.push(card3);
    }
  }
  for (let o = 0; o < suitsD.length; o++) {
    for (let p = 0; p < valuesD.length; p++ ) {
      let card4 = {
        suit: suitsD[o],
        value: valuesD[p]
      };
    deck.push(card4);
    }
  }
}

function shuffleDeck() {
  for (let i = 0; i < deck.length; i++) {
    let swapIndex = Math.floor(Math.random()*deck.length);
    let temp = deck[swapIndex];
    deck[swapIndex] = deck[i];
    deck[i] = temp;
  }
}

function addPlayers() {
  numberOfPlayers = document.getElementById("numberOfPlayers").value;
  for(let i = 1; i <= numberOfPlayers; i++) {
    let player = {
      id: "Player" + i,
      cards:  [],
      won: false,
      cardValue: 0,
      turn: false
    };
    players.push(player);
  }
}

function getNextCard() {
  return deck.shift();
}

function shareCards() {
  startingCard = getNextCard();
  for (let i = 0; i < numberOfCardsShared; i++) {
    for(let i = 0; i < players.length; i++) {
      players[i].cards.push(getNextCard());
    }
  }
}

function getCardString(card) {
  return card.suit + card.value;
}

function getSuitOnly(card) {
  return card.suit;
}

function getValueOnly(card) {
  return card.value;
}

function generateCardsGraphics() {

  let startingImage = document.createElement("img");
  startingCardDiv.appendChild(startingImage);
  startingImage.setAttribute("src", "images/"+getCardString(startingCard)+".png");
  startingImage.setAttribute("id", "startingImage");
  startingImage.setAttribute("name", getSuitOnly(startingCard));
  startingImage.setAttribute("value", getValueOnly(startingCard));
  startingImage.setAttribute("draggable", "false");
  for (i=0; i<players.length; i++) {
    let body = document.getElementById("body");
    let para = document.createElement("div");
    let label = document.createElement("label");
    let node0 = document.createTextNode("Player"+[i+1]);
    label.appendChild(node0);
    para.appendChild(label);
    para.setAttribute("id", "player"+[i+1]);
    body.appendChild(para);
    for (let j = 0; j < players[i].cards.length; j++) {
      let paras = document.createElement("img");
      paras.setAttribute("id", [i+1]+[j+1]);
      paras.setAttribute("src", "images/"+getCardString(players[i].cards[j])+".png");
      paras.setAttribute("class", [j]);
      paras.setAttribute("name", getSuitOnly(players[i].cards[j]));
      paras.setAttribute("value", getValueOnly(players[i].cards[j]));
      paras.setAttribute("draggable", "false");
      paras.setAttribute("ondragstart", "drag(event)");
      let divi = document.getElementById("player" +[i+1]);
      divi.appendChild(paras);
      divi.setAttribute("class", "4");
      divi.setAttribute("placeholder", "4");
    }
  }
}

// selectAndDragCards
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
  currentCard = ev.target;
}

let p = 0;

function drop(ev) {
  let e = ev;
  previousCard = ev.target;
  previousCardName = previousCard.name;
  let sImage = document.getElementById("startingImage");
  // Check card validity
  if (previousCard.name == "Whot") {
    previousCardName = selectedCardForWhot;
  }

  if (getSuitOnly(startingCard) == "Whot") {
    previousCardName = previousCard.name;
    whotCard = "Whot";
  }

  if (currentCard.name === "Whot" || whotCard == "Whot" ||
      previousCardName === currentCard.name || previousCard.getAttribute("value") === currentCard.getAttribute("value")) {
        whotCard = "";
        cardReplacement(e);
  }

  function cardReplacement (e) {
    e.preventDefault();
    let data = e.dataTransfer.getData("text");
    startingCardDiv.replaceChild(document.getElementById(data), startingCardDiv.firstChild);
    for(; p < 1; p++) {
      startingCardDiv.removeChild(sImage);
      playedDeck.push(startingCard);
    }
    let index = players[x].cards.findIndex(x => x.suit + x.value == currentCard.name + currentCard.getAttribute("value"));
    let playedCard = players[x].cards[index];
    playedDeck.push(playedCard);
    let availableCards = Number(document.getElementById("player"+(x+1).toString()).getAttribute("class"));
    availableCards -= 1;
    document.getElementById("player"+(x+1).toString()).setAttribute("class", availableCards.toString());
    players[x].cards.splice(index,1);

    checkForWinnerOrGameEnd();
    if (gameOver != true) {
      reAddPlayedCards();
      applyCardAbilities();
      if (neededCardsDivforWhot.style.display == "block") {
        document.getElementById("selectedCardForWhotButton").addEventListener("click", changeTurn);
      } else {
        changeTurn();
      }
    }

  }

  let cardsPlayed = startingCardDiv.querySelectorAll("img");
  for(let cp = 0; cp < cardsPlayed.length; cp++){
    cardsPlayed[cp].setAttribute("draggable", "false");
  }
  startingCard = "";
}
//End of select and drag function

function setTurn() {
  players[x].turn = true;
  card = document.getElementById("player"+(x+1).toString()).querySelectorAll("img");
  for(j = 0; j < card.length; j++) {
    card[j].setAttribute("draggable", "true");
  }
}

function changeTurn() {
  if (x != -1) {
    players[x].turn = false;
    let card = document.getElementById("player"+(x+1).toString()).querySelectorAll("img");
    for(j = 0; j < card.length; j++) {
      card[j].setAttribute("draggable", "false");
    }
  }

  x++;
  if (x==players.length) {
    x = 0;
  }

  players[x].turn = true;
  card = document.getElementById("player"+(x+1).toString()).querySelectorAll("img");
  for(j = 0; j < card.length; j++) {
    card[j].setAttribute("draggable", "true");
  }
}

/// // TODO: set back to availableCards and set only id to totalGottenCards

function applyCardAbilitiesStartingCard () {
  let availableCards = 0;
  switch (startingImage.getAttribute("value")) {
    case "Two":
      players[x].turn = false;
      let cardTwo = document.getElementById("player"+(x+1).toString()).querySelectorAll("img");
      for(j = 0; j < cardTwo.length; j++) {
        cardTwo[j].setAttribute("draggable", "false");
      }

      if (x==players.length - 1) {
        x = -1;
      }
      totalGottenCards = Number(document.getElementById("player"+(x+2).toString()).getAttribute("placeholder"));
      availableCards = Number(document.getElementById("player"+(x+1).toString()).getAttribute("class"));
      players[x].cards.push(getNextCard());
      players[x].cards.push(getNextCard());
      for (let j = availableCards; j < availableCards + 2; j++) {
        let paras = document.createElement("img");
        paras.setAttribute("id", [x+1]+[totalGottenCards+1]);
        paras.setAttribute("src", "images/"+getCardString(players[x].cards[j])+".png");
        paras.setAttribute("class", [j]);
        paras.setAttribute("name", getSuitOnly(players[x].cards[j]));
        paras.setAttribute("value", getValueOnly(players[x].cards[j]));
        paras.setAttribute("draggable", "false");
        paras.setAttribute("ondragstart", "drag(event)");
        let divi = document.getElementById("player" +(x+1).toString());
        divi.appendChild(paras);
        totalGottenCards ++;
      }
      availableCards += 2;
      document.getElementById("player"+(x+1).toString()).setAttribute("placeholder", totalGottenCards.toString());
      document.getElementById("player"+(x+1).toString()).setAttribute("class", availableCards.toString());
      x++;
      players[x].turn = true;
      cardTwo = document.getElementById("player"+(x+1).toString()).querySelectorAll("img");
      for(j = 0; j < cardTwo.length; j++) {
        cardTwo[j].setAttribute("draggable", "true");
      }
    break;
    case "Five":
    players[x].turn = false;
    let cardThree = document.getElementById("player"+(x+1).toString()).querySelectorAll("img");
    for(j = 0; j < cardThree.length; j++) {
      cardThree[j].setAttribute("draggable", "false");
    }

    if (x==players.length - 1) {
      x = -1;
    }
    totalGottenCards = Number(document.getElementById("player"+(x+1).toString()).getAttribute("placeholder"));
    availableCards = Number(document.getElementById("player"+(x+1).toString()).getAttribute("class"));
    players[x].cards.push(getNextCard());
    players[x].cards.push(getNextCard());
    players[x].cards.push(getNextCard());
    for (let j = availableCards; j < availableCards + 3; j++) {
      let paras = document.createElement("img");
      paras.setAttribute("id", [x+1]+[totalGottenCards+1]);
      paras.setAttribute("src", "images/"+getCardString(players[x].cards[j])+".png");
      paras.setAttribute("class", [j]);
      paras.setAttribute("name", getSuitOnly(players[x].cards[j]));
      paras.setAttribute("value", getValueOnly(players[x].cards[j]));
      paras.setAttribute("draggable", "false");
      paras.setAttribute("ondragstart", "drag(event)");
      let divi = document.getElementById("player" +(x+1).toString());
      divi.appendChild(paras);
      totalGottenCards ++;
    }

    availableCards += 3;
    document.getElementById("player"+(x+1).toString()).setAttribute("placeholder", totalGottenCards.toString());
    document.getElementById("player"+(x+1).toString()).setAttribute("class", availableCards.toString());
    x++;
    players[x].turn = true;
    cardThree = document.getElementById("player"+(x+1).toString()).querySelectorAll("img");
    for(j = 0; j < cardThree.length; j++) {
      cardThree[j].setAttribute("draggable", "true");
    }
    break;
    case "Eight":
      players[x].turn = false;
      let cardSuspend = document.getElementById("player"+(x+1).toString()).querySelectorAll("img");
      for(j = 0; j < cardSuspend.length; j++) {
        cardSuspend[j].setAttribute("draggable", "false");
      }
      x++;
      players[x].turn = true;
      cardSuspend = document.getElementById("player"+(x+1).toString()).querySelectorAll("img");
      for(j = 0; j < cardSuspend.length; j++) {
        cardSuspend[j].setAttribute("draggable", "true");
      }
    break;
    case "Fourteen":
      for (let i = 0; i < players.length; i++) {
          totalGottenCards = Number(document.getElementById("player"+(i+1).toString()).getAttribute("placeholder"));
          availableCards = Number(document.getElementById("player"+(i+1).toString()).getAttribute("class"));
          players[i].cards.push(getNextCard());
          for (let j = availableCards; j < availableCards + 1; j++) {
            let paras = document.createElement("img");
            paras.setAttribute("id", [i+1]+[totalGottenCards+1]);
            paras.setAttribute("src", "images/"+getCardString(players[i].cards[j])+".png");
            paras.setAttribute("class", [j]);
            paras.setAttribute("name", getSuitOnly(players[i].cards[j]));
            paras.setAttribute("value", getValueOnly(players[i].cards[j]));
            paras.setAttribute("draggable", "false");
            paras.setAttribute("ondragstart", "drag(event)");
            let divi = document.getElementById("player" +(i+1).toString());
            divi.appendChild(paras);
            totalGottenCards ++;
          }
          availableCards += 1;
          document.getElementById("player"+(i+1).toString()).setAttribute("placeholder", totalGottenCards.toString());
          document.getElementById("player"+(i+1).toString()).setAttribute("class", availableCards.toString());
        }
    break;
}
}

function applyCardAbilities () {
  let totalGottenCards = 0;
  let availableCards = 0;
  switch (currentCard.getAttribute("value")) {
    case "One":
      x = x - 1;

    break;
    case "Two":
      players[x].turn = false;
      let cardTwo = document.getElementById("player"+(x+1).toString()).querySelectorAll("img");
      for(j = 0; j < cardTwo.length; j++) {
        cardTwo[j].setAttribute("draggable", "false");
      }

      if (x==players.length - 1) {
        x = -1;
      }
      totalGottenCards = Number(document.getElementById("player"+(x+2).toString()).getAttribute("placeholder"));
      availableCards = Number(document.getElementById("player"+(x+2).toString()).getAttribute("class"));
      players[x+1].cards.push(getNextCard());
      players[x+1].cards.push(getNextCard());
      for (let j = availableCards; j < availableCards + 2; j++) {
        let paras = document.createElement("img");
        paras.setAttribute("id", [x+2]+[totalGottenCards+1]);
        paras.setAttribute("src", "images/"+getCardString(players[x+1].cards[j])+".png");
        paras.setAttribute("class", [j]);
        paras.setAttribute("name", getSuitOnly(players[x+1].cards[j]));
        paras.setAttribute("value", getValueOnly(players[x+1].cards[j]));
        paras.setAttribute("draggable", "false");
        paras.setAttribute("ondragstart", "drag(event)");
        let divi = document.getElementById("player" +(x+2).toString());
        divi.appendChild(paras);
        totalGottenCards ++;
      }
      availableCards += 2;
      document.getElementById("player"+(x+2).toString()).setAttribute("placeholder", totalGottenCards.toString());
      document.getElementById("player"+(x+2).toString()).setAttribute("class", availableCards.toString());
      x++;
      if (x==players.length) {
        x = 0;
      }
    break;
    case "Five":
    players[x].turn = false;
    let cardThree = document.getElementById("player"+(x+1).toString()).querySelectorAll("img");
    for(j = 0; j < cardThree.length; j++) {
      cardThree[j].setAttribute("draggable", "false");
    }

    if (x==players.length - 1) {
      x = -1;
    }
    totalGottenCards = Number(document.getElementById("player"+(x+2).toString()).getAttribute("placeholder"));
    availableCards = Number(document.getElementById("player"+(x+2).toString()).getAttribute("class"));
    players[x+1].cards.push(getNextCard());
    players[x+1].cards.push(getNextCard());
    players[x+1].cards.push(getNextCard());
    for (let j = availableCards; j < availableCards + 3; j++) {
      let paras = document.createElement("img");
      paras.setAttribute("id", [x+2]+[totalGottenCards+1]);
      paras.setAttribute("src", "images/"+getCardString(players[x+1].cards[j])+".png");
      paras.setAttribute("class", [j]);
      paras.setAttribute("name", getSuitOnly(players[x+1].cards[j]));
      paras.setAttribute("value", getValueOnly(players[x+1].cards[j]));
      paras.setAttribute("draggable", "false");
      paras.setAttribute("ondragstart", "drag(event)");
      let divi = document.getElementById("player" +(x+2).toString());
      divi.appendChild(paras);
      totalGottenCards ++;
    }

    availableCards += 3;
    document.getElementById("player"+(x+2).toString()).setAttribute("placeholder", totalGottenCards.toString());
    document.getElementById("player"+(x+2).toString()).setAttribute("class", availableCards.toString());
    x++;
    if (x==players.length) {
      x = 0;
    }
    break;
    case "Eight":
      players[x].turn = false;
      let cardSuspend = document.getElementById("player"+(x+1).toString()).querySelectorAll("img");
      for(j = 0; j < cardSuspend.length; j++) {
        cardSuspend[j].setAttribute("draggable", "false");
      }
      x++;
      if (x==players.length) {
        x = 0;
      }
    break;
    case "Fourteen":
      for (let i = 0; i < players.length; i++) {
        if (i == x) {
          continue;
        } else {
          totalGottenCards = Number(document.getElementById("player"+(i+1).toString()).getAttribute("placeholder"));
          availableCards = Number(document.getElementById("player"+(i+1).toString()).getAttribute("class"));
          players[i].cards.push(getNextCard());
          for (let j = availableCards; j < availableCards + 1; j++) {
            let paras = document.createElement("img");
            paras.setAttribute("id", [i+1]+[totalGottenCards+1]);
            paras.setAttribute("src", "images/"+getCardString(players[i].cards[j])+".png");
            paras.setAttribute("class", [j]);
            paras.setAttribute("name", getSuitOnly(players[i].cards[j]));
            paras.setAttribute("value", getValueOnly(players[i].cards[j]));
            paras.setAttribute("draggable", "false");
            paras.setAttribute("ondragstart", "drag(event)");
            let divi = document.getElementById("player" +(i+1).toString());
            divi.appendChild(paras);
            totalGottenCards ++;
          }
          availableCards += 1;
          document.getElementById("player"+(i+1).toString()).setAttribute("placeholder", totalGottenCards.toString());
          document.getElementById("player"+(i+1).toString()).setAttribute("class", availableCards.toString());
        }
      }
      x = x - 1;
    break;
    case "20":
    players[x].turn = false;
    let cardWhot = document.getElementById("player"+(x+1).toString()).querySelectorAll("img");
    for(j = 0; j < cardWhot.length; j++) {
      cardWhot[j].setAttribute("draggable", "false");
    }
      let whotPlayerDiv = document.getElementById("player"+(x+1).toString());
      whotPlayerDiv.appendChild(neededCardsDivforWhot);
      neededCardsDivforWhot.style.display = "block";
      document.getElementById("selectedCardForWhotButton").addEventListener("click", changeWhotNeededCard);
    break;
  }
}

function changeWhotNeededCard () {
  selectedCardForWhot = document.getElementById("neededCardsSelect").value;
  neededCardsDivforWhot.style.display = "none";
}

function getCardFromDeck() {
  if (deck.length != 0) {
    players[x].cards.push(getNextCard());
    let totalGottenCards = Number(document.getElementById("player"+(x+1).toString()).getAttribute("placeholder"));
    let availableCards = Number(document.getElementById("player"+(x+1).toString()).getAttribute("class"));
    for (let j = availableCards; j < availableCards + 1; j++) {
      let paras = document.createElement("img");
      paras.setAttribute("id", [x+1]+[totalGottenCards+1]);
      paras.setAttribute("src", "images/"+getCardString(players[x].cards[j])+".png");
      paras.setAttribute("class", [j]);
      paras.setAttribute("name", getSuitOnly(players[x].cards[j]));
      paras.setAttribute("value", getValueOnly(players[x].cards[j]));
      paras.setAttribute("draggable", "false");
      paras.setAttribute("ondragstart", "drag(event)");
      let divi = document.getElementById("player" +(x+1).toString());
      divi.appendChild(paras);
      totalGottenCards ++;
    }
    availableCards += 1;
    document.getElementById("player"+(x+1).toString()).setAttribute("placeholder", totalGottenCards.toString());
    document.getElementById("player"+(x+1).toString()).setAttribute("class", availableCards.toString());
    reAddPlayedCards();
    changeTurn();
  }

}

function reAddPlayedCards () {
  if (playedDeck.length != 0) {
    if (deck.length <= 10) {
      for (let i = 0; i < playedDeck.length; i++) {
        let swapIndex = Math.floor(Math.random()*playedDeck.length);
        let temp = playedDeck[swapIndex];
        playedDeck[swapIndex] = playedDeck[i];
        playedDeck[i] = temp;
      }
      deck = deck.concat(playedDeck);
    }
  }

}

function checkForWinnerOrGameEnd () {
  for (let i = 0; i < players.length; i++) {
    let cardsLeft = players[i].cards.length;
    if(cardsLeft == 0) {
      textArea.innerText = "Player "+[i+1] + " is the Winner";
      startButton.style.display = "block";
      getDeckCardButton.style.display = "none";
      restartGame();
      gameStarted = false;
      gameOver = true;
      break;

    }
  }
}

function restartGame() {
  deck = [];
  playedDeck = [];

  for (let i = 1; i <= players.length; i++) {
    parent = document.getElementById("body");
    child = document.getElementById("player" + [i]);
    parent.removeChild(child);
  }
  while(startingCardDiv.firstChild) {
    startingCardDiv.removeChild(startingCardDiv.firstChild);
  }
  players = [];
  let selectedCardForWhot = "";
  let startingCard = "";
  let playedPlayerId = "";
  let x = 0;
  let y = 0;
  let currentCard = {};
  let previousCard = {};
  let previousCardName = "";
  let whotCard = "";
}
