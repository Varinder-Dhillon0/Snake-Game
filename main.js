// Initialize layout
resetGame();

window.addEventListener("keydown", (event) => keyEvents(event));

// Start the game
function startGame() {
  nomusic ? music.play() : "";
  gameStarted = true;
  noteElement.style.opacity = 0;
  window.requestAnimationFrame(main);
}

let count = 0;

// The main game loop
// This function gets invoked approximately 60 times per second to render the game
// It keeps track of the total elapsed time and time elapsed since last call
// Based on that animates the snake either by transitioning it in between tiles or stepping it to the next tile
function main(timestamp) {
  try {
    if (startTimestamp === undefined) startTimestamp = timestamp;
    const totalElapsedTime = timestamp - startTimestamp;
    const timeElapsedSinceLastCall = timestamp - lastTimestamp;
    // console.log( totalElapsedTime / 1000);

    const stepsShouldHaveTaken = Math.floor(totalElapsedTime / speed);
    const percentageOfStep = (totalElapsedTime % speed) / speed;

    if (stepsTaken !== stepsShouldHaveTaken) {
      // If the snake took a step from a tile to another one
      stepAndTransition(percentageOfStep);

      // If it’s time to take a step
      const headPosition = snakePositions[snakePositions.length - 1];
      if (headPosition == applePosition) {
        // Increase score
        score++;
        scoreElement.innerText =score;

        // Generate another apple
        addNewApple();
      }

      stepsTaken++;
    }

    window.requestAnimationFrame(main);
  } catch (error) {
    if(score > high_score){
      high_score = score;
      highscore.innerHTML = `H ${high_score}`;
      localStorage.setItem("high" , score);
    }

    // Write a note about restarting game and setting difficulty
    const pressSpaceToStart = `<br/>Press <img src="controls/space.svg" width="20px"/> to reset the game.`;
    music.pause();
    music.currentTime = 0;
    nosfx ? playLoseSound() : "";
    noteElement.innerHTML = `${error.message}. ${pressSpaceToStart}`;
    noteElement.style.opacity = 1;
    containerElement.style.opacity = 1;
  }

  lastTimestamp = timestamp;
}

// Moves the snake and sets up tiles for the transition function so the transition function will be more effective (the transition function gets called more frequently)
function stepAndTransition(percentageOfStep) {
  // Calculate the next position and add it to the snake
  const newHeadPosition = getNextPosition();
  // console.log(`Snake stepping into tile ${newHeadPosition}`);
  snakePositions.push(newHeadPosition);

  // Start with tail instead of head
  // Because the head might step into the previous position of the tail

  // Clear tile, yet keep it in the array if the snake grows.
  // Whenever the snake steps into a new tile, it will leave the last one.
  // Yet the last tile stays in the array if the snake just grows.
  // As a sideeffect in case the snake just eats an apple,
  // the tail transitioning will happen on a this "hidden" tile
  // (so the tail appears as stationary).
  const previousTail = tiles[snakePositions[0]];
  setTile(previousTail);

  if (newHeadPosition != applePosition) {
    // Drop the previous tail
    snakePositions.shift();

    // Set up and start transition for new tail
    // Make sure it heads to the right direction and set initial size
    const tail = tiles[snakePositions[0]];
    const tailDi = tailDirection();
    // The tail value is inverse because it slides out not in
    if (tailDi == RIGHT)
      setTile(tail, {
        "background-image": `url(${tailImg[2]})`,
        "background-size": "cover",
      });

    if (tailDi == LEFT)
      setTile(tail, {
        "background-image": `url(${tailImg[3]})`,
        "background-size": "cover",
      });

    if (tailDi == DOWN)
      setTile(tail, {
        "background-image": `url(${tailImg[1]})`,
        "background-size": "cover",
      });

    if (tailDi == UP)
      setTile(tail, {
        "background-image": `url(${tailImg[0]})`,
        "background-size": "cover",
      });
  }

  //updating nodes directions
  nodeDirection();
  // console.log("node- dir : " , nodeDirections);;
  const headDi = headDirection();
  // Set previous head to full size
  const previousHead = nodeDirections[nodeDirections.length - 1];

  let bodyBendDir;
  bendpos = tiles[previousHead.position];
  if (previousHead.direction !== headDi) {
    bodyBendDir = headDi + previousHead.direction;
    setTile(bendpos, {
      "background-image": `url(Graphics/${bodyBendsImg[bodyBendDir]})`,
      "background-size": "cover",
    });
  } else {
    if (previousHead.direction == UP || previousHead.direction == DOWN) {
      setTile(bendpos, {
        "background-image": `url(${bodyImg[1]})`,
        "background-size": "cover",
      });
    } else {
      setTile(bendpos, {
        "background-image": `url(${bodyImg[0]})`,
        "background-size": "cover",
      });
    }
  }

  // Set up and start transitioning for new head
  // Make sure it heads to the right direction and set initial size
  const head = tiles[newHeadPosition];
  const headNearApple = nearApple(newHeadPosition);

  const headValue = `${percentageOfStep * 100}%`;
  if (headDi == RIGHT)
    setTile(head, {
      "background-image": `url(${
        headNearApple ? snakeEatingImg[2] : snakeImg[2]
      })`,
      "background-size": "cover",
    });

  if (headDi == LEFT)
    setTile(head, {
      "background-image": `url(${
        headNearApple ? snakeEatingImg[3] : snakeImg[3]
      })`,
      "background-size": "cover",
    });

  if (headDi == DOWN)
    setTile(head, {
      "background-image": `url(${
        headNearApple ? snakeEatingImg[1] : snakeImg[1]
      })`,
      "background-size": "cover",
    });

  if (headDi == UP)
    setTile(head, {
      "background-image": `url(${
        headNearApple ? snakeEatingImg[0] : snakeImg[0]
      })`,
      "background-size": "cover",
    });
}

function nodeDirection() {
  // Clear the nodeDirections array
  // Iterate over snake's body
  nodeDirections = [];

  for (let i = 1; i < snakePositions.length - 1; i++) {
    const position = snakePositions[i];
    const direction = getDirection(snakePositions[i], snakePositions[i - 1]);
    // Push the position and direction as a pair into the nodeDirections array
    nodeDirections.push({ position, direction });
  }
}
// Calculate to which tile will the snake step into
// Throw error if the snake bites its tail or hits the wall
function getNextPosition() {
  const headPosition = snakePositions[snakePositions.length - 1];
  const snakeDirection = inputs.shift() || headDirection();
  switch (snakeDirection) {
    case RIGHT: {
      const nextPosition = headPosition + 1;
      if (nextPosition % width == 0) throw Error("The snake hit the wall");
      // Ignore the last snake part, it'll move out as the head moves in
      if (snakePositions.slice(1).includes(nextPosition))
        throw Error("The snake bit itself");
      return nextPosition;
    }
    case LEFT: {
      const nextPosition = headPosition - 1;
      if (nextPosition % width == width - 1 || nextPosition < 0)
        throw Error("The snake hit the wall");
      // Ignore the last snake part, it'll move out as the head moves in
      if (snakePositions.slice(1).includes(nextPosition))
        throw Error("The snake bit itself");
      return nextPosition;
    }
    case DOWN: {
      const nextPosition = headPosition + height;
      if (nextPosition > width * height - 1)
        throw Error("The snake hit the wall");
      // Ignore the last snake part, it'll move out as the head moves in
      if (snakePositions.slice(1).includes(nextPosition))
        throw Error("The snake bit itself");
      return nextPosition;
    }
    case UP: {
      const nextPosition = headPosition - height;
      if (nextPosition < 0) throw Error("The snake hit the wall");
      // Ignore the last snake part, it'll move out as the head moves in
      if (snakePositions.slice(1).includes(nextPosition))
        throw Error("The snake bit itself");
      return nextPosition;
    }
  }
}

// Calculate in which direction the snake's head is moving
function headDirection() {
  const head = snakePositions[snakePositions.length - 1];
  const neck = snakePositions[snakePositions.length - 2];
  return getDirection(head, neck);
}

// Calculate in which direction of the snake's tail
function tailDirection() {
  const tail1 = snakePositions[0];
  const tail2 = snakePositions[1];
  return getDirection(tail1, tail2);
}

function getDirection(first, second) {
  if (first - 1 == second) return RIGHT;
  if (first + 1 == second) return LEFT;
  if (first - width == second) return DOWN;
  if (first + width == second) return UP;
  throw Error("the two tile are not connected");
}

// Generates a new apple on the field
function addNewApple() {
  // Find a position for the new apple that is not yet taken by the snake
  tiles[applePosition].classList.remove("apple");
  let newPosition;
  nosfx ? playEatSound()  : "";

  playHeartAnimation();
  do {
    newPosition = Math.floor(Math.random() * width * height);
  } while (snakePositions.includes(newPosition));

  // Set new apple
  tiles[newPosition].classList.add("apple");
  setTile(tiles[newPosition], {
    "background-image": "url(Graphics/apple.png)",
    "background-size": "cover",
  });

  // Note that the apple is here
  applePosition = newPosition;
}

// Resets size and position related CSS properties
function setTile(element, overrides = {}) {
  let bacColor = "#add644";
  if (parseInt(element.id) % 2 == 0) {
    bacColor = "#b6e343";
  }

  const defaultStyles = {
    width: "100%",
    height: "100%",
    top: "auto",
    right: "auto",
    bottom: "auto",
    left: "auto",
    "background-color": bacColor,
  };
  const cssProperties = { ...defaultStyles, ...overrides };
  element.style.cssText = Object.entries(cssProperties)
    .map(([key, value]) => `${key}: ${value};`)
    .join(" ");
}

const playHeartAnimation = () => {
  heartbeat.style.cssText = "animation: beat 1s linear; ";
  heartecho.style.cssText = "animation: echo 1s linear;";

  setTimeout(() => {
    heartbeat.style.cssText = "";
    heartecho.style.cssText = "";
  }, 1000);
};

function nearApple(headPosition) {
  const nearbyPositions = new Set([
    headPosition - 2, headPosition + 2, headPosition - 1, headPosition + 1,
    headPosition + 30, headPosition - 30, headPosition - 31, headPosition + 31,
    headPosition - 32, headPosition + 32, headPosition - 15, headPosition + 15,
    headPosition - 14, headPosition + 14, headPosition + 28, headPosition - 28,
    headPosition - 29, headPosition + 29, headPosition + 16, headPosition - 16,
    headPosition - 13, headPosition + 13, headPosition + 17, headPosition - 17
  ]);

  return nearbyPositions.has(applePosition);
}

function playEatSound() {
  // Play the sound
  eatSound.play();
}

function playLoseSound(){

  loseSound.play();
}

const sfx = document.querySelector(".sfx");
const music1 = document.querySelector(".music");


sfx.addEventListener("click", () =>{
  sfx.classList.toggle("active");
  if(sfx.classList.contains("active")){
    sfx.innerHTML = `<i class="fa-solid fa-volume-off"></i>`;
  }else{
    sfx.innerHTML = `<i class="fa-solid fa-volume-high"></i>`;
  }
  
  nosfx = !nosfx;

})

music1.addEventListener("click", () => {
  line.classList.toggle("line");
  nomusic = !nomusic;
});