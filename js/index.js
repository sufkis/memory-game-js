const URL_LIST = [
  "https://dog.ceo/api/breeds/image/random/15",
  "https://flagcdn.com/en/codes.json",
  "https://hp-api.onrender.com/api/characters"
]

const cardImages = [];
let cardFlips = 0;

const handleOnButtonClick = () => {
  swal({
    buttons: {
      hp: "Harry Potter",
      dog: "Dogs",
      flag: "Country Flags"
    },
    closeOnClickOutside: false,
    closeOnEsc: false
  }).then(async (value) => {
    switch (value) {
      case "dog":
        const dogData = await getData(URL_LIST[0]);
        console.log("dogs", dogData.message);
        break;
      case "flag":
        const flagData = await getData(URL_LIST[1]);
        const flagImages = Object.keys(flagData).slice(0,15).map(cc => `https://flagcdn.com/${cc}.svg`)
        console.log("flags", flagImages);

        break;
      default:
        const hpData = await getData(URL_LIST[2]);
        const hrImages = hpData.slice(0, 15).map(ch => ch.image);
        populateCardImages(hrImages);
        startGame();
        break;
    }
  });
}

const handleOnCardClick = (cardId) => {
  const id = +cardId.split("-")[1];
  const card = document.getElementById(cardId);
  const image = `<img src="${cardImages[id]}" alt="${cardId}" class="image">`
  card.innerHTML = image;
}

const startGame = () => {
  const allCards = document.querySelectorAll(".card");
  allCards.forEach(card => card.classList.remove("disabled"));
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