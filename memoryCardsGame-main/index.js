const gridContainer = document.getElementById("playPage");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
var endGame = 0;
let finalCards = [];
let startTime, timerInterval;
let timeElapsed = 0;
document.getElementById('Result').style.visibility = 'hidden';


fetch("./data/cards.json")
  .then((res) => res.json())
  .then((data) => {
    cards = [...data, ...data];
  });


function redirect() {
  const form = document.getElementById("gameForm");
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  document.getElementById("mainPage").classList.add("hidden");
  document.getElementById("gamePage").classList.remove("hidden");

  const playerName = document.getElementById("name").value;
  document.getElementById("playerName").innerText = `Player Name: ${playerName}`;

  var cardCount = document.getElementById("cardsQty").value;
  var tempCardsSize = parseInt(cardCount);

  const selectedCards = cards.slice(0, tempCardsSize);
  finalCards = [...selectedCards, ...selectedCards];

  shuffleCards(finalCards);
  generateCards(finalCards);


  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000);
}

function shuffleCards(cards) {
  let currentIndex = cards.length,
    randomIndex, temporaryValue;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }
}

function generateCards(cards) {
  gridContainer.innerHTML = "";

  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
      <div class="front">
        <img class="front-image" src=${card.image} />
      </div>
      <div class="back"></div>
    `;
    gridContainer.appendChild(cardElement);
    cardElement.addEventListener("click", flipCard);
  }
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true;
  checkForMatch();
}


function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;
  if (isMatch) {
    disableCards();
    endGame++;


    if (endGame === (finalCards.length / 2)) {
      clearInterval(timerInterval);
      document.getElementById('Result').style.visibility = 'visible';
      document.getElementById('timeResult').innerText = `Time taken: ${formatTime(timeElapsed)}`;
    }
  } else {
    unflipCards();
  }
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  resetBoard();
}


function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}

function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function restart() {
  gridContainer.innerHTML = "";
  resetBoard();
  var cardCount = document.getElementById("cardsQty").value;
  var tempCardsSize = parseInt(cardCount);
  const selectedCards = cards.slice(0, tempCardsSize);
  finalCards = [...selectedCards, ...selectedCards];
  shuffleCards(finalCards);
  generateCards(finalCards);
  document.getElementById('Result').style.visibility = 'hidden';
  endGame = 0;
  startTime = Date.now();
  timeElapsed = 0;
  timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
  timeElapsed = Math.floor((Date.now() - startTime) / 1000);
  document.getElementById('safeTimerDisplay').innerText = ` ${formatTime(timeElapsed)}`;
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

  return `${formattedMinutes}:${formattedSeconds}`;
}