
function keyEvents(event){
    // If not an arrow key or space or H was pressed then return
  if (!["ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown", " ", "H", "h", "E", "e"].includes(event.key)) return;

  // If an arrow key was pressed then first prevent default
  event.preventDefault();

  // If space was pressed restart the game
  if (event.key == " ") {
    resetGame();
    startGame();
    return;
  }

  // Set Hard mode
  if (event.key == "H" || event.key == "h") {
    hardMode = true;
    fadeSpeed = 4000;
    fadeExponential = 1.025;
    noteElement.innerHTML = `Hard mode. Press space to start!`;
    noteElement.style.opacity = 1;
    resetGame();
    return;
  }

  // Set Easy mode
  if (event.key == "E" || event.key == "e") {
    hardMode = false;
    fadeSpeed = 5000;
    fadeExponential = 1.024;
    noteElement.innerHTML = `Easy mode. Press space to start!`;
    noteElement.style.opacity = 1;
    resetGame();
    return;
  }

  // If an arrow key was pressed add the direction to the next moves
  // Do not allow to add the same direction twice consecutively
  // The snake can't do a full turn either
  // Also start the game if it hasn't started yet
  if (event.key == "ArrowLeft" && inputs[inputs.length - 1] != LEFT && headDirection() != RIGHT) {
    inputs.push(LEFT);
    if (!gameStarted) startGame();
    return;
  }
  if (event.key == "ArrowUp" && inputs[inputs.length - 1] != UP && headDirection() != DOWN) {
      inputs.push(UP);
      if (!gameStarted) startGame();
      return;
    }
    if (event.key == "ArrowRight" && inputs[inputs.length - 1] != RIGHT && headDirection() != LEFT) {
      inputs.push(RIGHT);
      if (!gameStarted) startGame();
      return;
    }
    if (event.key == "ArrowDown" && inputs[inputs.length - 1] != DOWN && headDirection() != UP) {
      inputs.push(DOWN);
      if (!gameStarted) startGame();
      return;
    }    
}