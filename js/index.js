const URL_LIST = [
  "https://dog.ceo/api/breeds/image/random/15",
  "https://flagcdn.com/en/codes.json",
  "https://hp-api.onrender.com/api/characters"
]

let cardImages = [];
let flippedCardId = "";
let foundCards = [];

const handleOnButtonClick = () => {
  if (cardImages.length) {
    resetGame();
  }
  swal({
    buttons: {
      hp: "Harry Potter",
      dog: "Dogs",
      flag: "Country Flags",
      random: "Surprise Me! (Random)"
    },
    closeOnClickOutside: false,
    closeOnEsc: false
  }).then(async (value) => {
    switch (value) {
      case "dog":
        const dogData = await getData(URL_LIST[0]);
        startGame(dogData.message);
        break;
      case "flag":
        const flagData = await getData(URL_LIST[1]);
        const flagImages = Object.keys(flagData).slice(0,15).map(cc => `https://flagcdn.com/${cc}.svg`);
        startGame(flagImages);
        break;
      case "hr":
        const hpData = await getData(URL_LIST[2]);
        const hrImages = hpData.slice(0, 15).map(ch => ch.image);
        startGame(hrImages);
        break;
      default:
        const randomNumber = getRandomNumber(0, 2)
        const randomData = await getData(URL_LIST[randomNumber]);
        let randomImages;
        if (randomNumber === 2) {
          randomImages = randomData.slice(0, 15).map(ch => ch.image);
        }
        else if (randomNumber === 1) {
          randomImages = Object.keys(randomData).slice(0,15).map(cc => `https://flagcdn.com/${cc}.svg`)
        }
        else {
          randomImages = randomData.message;
        }
        startGame(randomImages);
        break;
    }
  });
}

const handleOnCardClick = (cardId) => {
  const index = +cardId.split("-")[1];
  if (foundCards.includes(cardImages[index]) || !cardImages.length) {
    return;
  }
  const card = document.getElementById(cardId);
  card.classList.add("flip");
  const image = `<img src="${cardImages[index]}" alt="${cardId}" class="image">`
  setTimeout(() => {
    card.innerHTML = image;
  }, 100);
  setTimeout(() => {
    card.classList.remove("flip");
  }, 300);
  if(!flippedCardId) {
    flippedCardId = cardId;
  }
  else {
    const flippedIndex = +flippedCardId.split("-")[1]
    if (cardImages[index] === cardImages[flippedIndex]) {
      flippedCardId = "";
      foundCards.push(cardImages[index]);
      if (foundCards.length === 15) {
        foundCards = [];
        setTimeout(() => {
          
          cardImages = []
          swal({
            title: "Well Done!",
            button: "Play again!",
          }).then(() => {
            resetGame();
            handleOnButtonClick();
          });
        }, 100);
      }
      return;
    }
    else {
      const flippedCard = document.getElementById(flippedCardId);
      flippedCardId = "";
      setTimeout(() => {
        card.classList.add("unflip");
        flippedCard.classList.add("unflip");
        setTimeout(() => {
          card.innerHTML = "";
          flippedCard.innerHTML = "";
        }, 150);
        setTimeout(() => {
          card.classList.remove("unflip");
          flippedCard.classList.remove("unflip");
        }, 300);
      }, 1000);
    }
  }
}

const startGame = (images) => {
  populateCardImages(images);
  const allCards = document.querySelectorAll(".card");
  allCards.forEach(card => card.classList.remove("disabled"));
}

const resetGame = () => {
  cardImages = [];
  foundCards = [];
  const allCards = document.querySelectorAll(".card");
  allCards.forEach(card => {
    card.classList.add("unflip");
    setTimeout(() => {
      card.innerHTML = "";
    }, 150);
    setTimeout(() => {
      card.classList.remove("unflip");
    }, 300);
  });
}

const getData = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }
  catch (err) {
    console.error(err);
  }
}

const populateCardImages = (images) => {
  images.forEach(image => {
    let count = 0;
    while (count < 2) {
      const randomNumber = getRandomNumber(0, 29);
      if (!cardImages[randomNumber]) {
        cardImages[randomNumber] = image;
        count++
      }
    }
  });
}

const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}