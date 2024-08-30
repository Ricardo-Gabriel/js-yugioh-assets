const state = {
  score: {
    playerScore: 0,
    computerScore: 0,
    scoreBox: document.getElementById("score_points"),
  },
  cardSprits: {
    avatar: document.getElementById("card-image"),
    name: document.getElementById("card-name"),
    type: document.getElementById("card-type"),
  },
  fieldCards: {
    player: document.getElementById("player-field-card"),
    computer: document.getElementById("computer-field-card"),
  },
  actions: {
    button: document.getElementById("next-duel"),
  },
  playerSides : {
    player1: "player-cards",
    player1BOX: document.querySelector("#player-cards"),
    computer: "computer-cards",
    computerBOX: document.querySelector("#computer-cards"),
  },
};

const playerSides = {
  player1: "player-cards",
  computer: "computer-cards",
};

const pathImages = "./src/assets/icons/";

const cardData = [
  {
    id: 0,
    name: "Blue Eyes White Dragon",
    type: "Papel",
    img: `${pathImages}dragon.png`,
    winOf: [1],
    loseOf: [2],
  },
  {
    id: 1,
    name: "Dark Magician",
    type: "Pedra",
    img: `${pathImages}magician.png`,
    winOf: [2],
    loseOf: [0],
  },
  {
    id: 2,
    name: "Exodia",
    type: "Tesoura",
    img: `${pathImages}exodia.png`,
    winOf: [0],
    loseOf: [1],
  },
];

async function getRandomCardId() {
  const randomIndex = Math.floor(Math.random() * cardData.length);
  return cardData[randomIndex].id;
}

async function createCardImage(idCard, fieldSide) {
  const cardImage = document.createElement("img");
  cardImage.setAttribute("height", "100px");
  cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
  cardImage.setAttribute("data-id", idCard);
  cardImage.classList.add("card");

  if (fieldSide === playerSides.player1) {
    cardImage.addEventListener("click", () => {
      setCardsField(cardImage.getAttribute("data-id"));
    });
    cardImage.addEventListener("mouseover", () => {
      drawSelectCard(idCard);
    });
  }
  return cardImage;
}

async function setCardsField(cardId) {
  await removeAllCardsImages();
  let computerCardId = await getRandomCardId();

  state.fieldCards.player.style.display = "block";
  state.fieldCards.computer.style.display = "block";

   await hiddenCardDetails()

  state.fieldCards.player.src = cardData[cardId].img;
  state.fieldCards.computer.src = cardData[computerCardId].img;

  let duelResults = await checkDuelResults(cardId,computerCardId);

  await updateScore();
  await drawButton(duelResults);
}

async function hiddenCardDetails() {
  state.cardSprits.avatar.src =""
  state.cardSprits.name.innerText = ""
  state.cardSprits.type.innerText = ""
}

async function drawButton(text) {
    state.actions.button.innerText = text
    state.actions.button.style.display ="block"
    
}

async function checkDuelResults(playerCardId,computerCardId) {
    let duelResults = "Empate";
    let playerCard = cardData[playerCardId];
    

    if(playerCard.winOf.includes(computerCardId)){
        duelResults = "Ganhou!"
        playAudio("win")
        state.score.playerScore++;
    }
    if(playerCard.loseOf.includes(computerCardId)){
        duelResults ="Perdeu!"
        playAudio("lose")
        state.score.computerScore++;
    }

    return duelResults
    
}

async function resetDuel() {
    state.cardSprits.avatar.src ="";
    state.actions.button.style.display = "none"

    state.fieldCards.player.style.display = "none"
    state.fieldCards.computer.style.display = "none"

    init()

}


async function updateScore() {
    state.score.scoreBox.innerText = 
    `Win: ${state.score.playerScore}
     Lose ${state.score.computerScore}`
}

async function drawCards(cardNumbers, fieldSide) {
  for (let i = 0; i < cardNumbers; i++) {
    const randomIdCard = await getRandomCardId();
    const cardImage = await createCardImage(randomIdCard, fieldSide);

    document.getElementById(fieldSide).appendChild(cardImage);
  }
}

async function drawSelectCard(index) {
  state.cardSprits.avatar.src = cardData[index].img;
  state.cardSprits.name.innerText = cardData[index].name;
  state.cardSprits.type.innerText = "atribute: " + cardData[index].type;
}

async function removeAllCardsImages() {
  let {computerBOX,player1BOX} =state.playerSides;
  
  let imgElements = computerBOX.querySelectorAll("img");
  imgElements.forEach((img) => img.remove());

  
  imgElements = player1BOX.querySelectorAll("img");
  imgElements.forEach((img) => img.remove());
}

function init() {
  drawCards(5, playerSides.player1);
  drawCards(5, playerSides.computer);
}


async function playAudio(status) {
    const audio = new Audio(`src/assets/audios/${status}.wav`)
    audio.play()

    const bgm = document.getElementById("bgm")
    bgm.play()
    
}

init();


