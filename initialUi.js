// Setup: Build up the grid
// The grid consists of (width x height) tiles
// The tiles take the the shape of a grid using CSS grid
// The tile can represent a part of the snake or an apple
// Each tile has a content div that takes an absolute position
// The content can fill the tile or slide in or out from any direction to take the shape of a transitioning snake head or tail
const grid = document.querySelector(".grid");
for (let i = 0; i < width * height; i++) {
  const content = document.createElement("div");
  content.setAttribute("class", "content");
  content.setAttribute("id", i); // Just for debugging, not used
  const tile = document.createElement("div");
  tile.setAttribute("class", "tile");
  tile.appendChild(content);

  grid.appendChild(tile);
}

const tiles = document.querySelectorAll(".grid .tile .content");

const containerElement = document.querySelector(".container");
const noteElement = document.querySelector("footer");
const contrastElement = document.querySelector(".contrast");
const scoreElement = document.querySelector(".score");
const highscore = document.querySelector(".h-score");

var speedSlider = new Slider("#speed-slider", {
  tooltip: 'always'
});

speedSlider.on('slide', function(sliderValue) {
  console.log(sliderValue);
  speed = 100;
  speed = speed - sliderValue;
});

// Resets game variables and layouts but does not start the game (game starts on keypress)
function resetGame() {
  // Reset positions
  snakePositions = [168, 169, 170, 171];
  tiles[applePosition].classList.remove("apple");
  applePosition = 100; // Initially the apple is always at the same position to make sure it's reachable
  tiles[applePosition].classList.add("apple");

  highscore.innerHTML = `H ${high_score}`;
  // Reset game progress
  startTimestamp = undefined;
  lastTimestamp = undefined;
  stepsTaken = -1; // It's -1 because then the snake will start with a step
  score = 0;
  // contrast = 1;

  nodeDirections = [];

  // Reset inputs
  inputs = [];

  // Reset header
  scoreElement.innerText = score;

  // Reset tiles
  for (const tile of tiles) setTile(tile);

  // Render apple
  setTile(tiles[applePosition], {
    "background-image": "url(Graphics/apple.png)",
    "background-size": "cover",
  });

  //rendering snake
  setTile(tiles[snakePositions[snakePositions.length - 1]], {
    "background-image": "url(Graphics/head_right.png)",
    "background-size": "cover",
  });

  setTile(tiles[snakePositions[2]], {
    "background-image": "url(Graphics/body_horizontal.png)",
    "background-size": "cover",
  });

  setTile(tiles[snakePositions[1]], {
    "background-image": "url(Graphics/body_horizontal.png)",
    "background-size": "cover",
  });

  setTile(tiles[snakePositions[0]], {
    "background-image": "url(Graphics/tail_left.png)",
    "background-size": "cover",
  });

  // Render snake
  // Ignore the last part (the snake just moved out from it)
  for (const i of snakePositions.slice(1)) {
    const snakePart = tiles[i];

    // Set up transition directions for head and tail
    if (i == snakePositions[snakePositions.length - 1])
      snakePart.style.left = 0;
    if (i == snakePositions[0]) snakePart.style.right = 0;
  }
}
