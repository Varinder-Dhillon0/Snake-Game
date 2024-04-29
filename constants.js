let snakePositions; // An array of snake positions, starting head first
let applePosition = 100; // The position of the apple

let startTimestamp; // The starting timestamp of the animation
let lastTimestamp; // The previous timestamp of the animation
let stepsTaken; // How many steps did the snake take
let score;
let contrast;
let high_score = localStorage.getItem("high") || 0;

let inputs; // A list of directions the snake still has to take in order

let gameStarted = false;
let hardMode = false;

// Configuration
const width = 15; // Grid width
const height = 15; // Grid height

let speed = 100; // Milliseconds it takes for the snake to take a step in the grid
let fadeSpeed = 5000; // milliseconds it takes the grid to disappear (initially)
let fadeExponential = 1.024; // after each score it will gradually take more time for the grid to fade
//   const contrastIncrease = 0.5; // contrast you gain after each score
const color = "green"; // Primary color

//directions
const RIGHT = "right";
const LEFT = "left";
const UP = "up";
const DOWN = "down";

let nodeDirections = [
  {
    position: 170,
    direction: "right",
  },
  {
    position: 171,
    direction: "right",
  },
];

//bending images for the body
const bodyBendsImg = {
  upright: "body_topr.png",
  rightup: "body_bottoml.png",
  upleft: "body_topl.png",
  leftup: "body_bottomr.png",
  downright: "body_bottomr.png",
  rightdown: "body_topl.png",
  downleft: "body_bottoml.png",
  leftdown: "body_topr.png",
};

const snakeImg = ["Graphics/head_up.png", "Graphics/head_down.png", "Graphics/head_right.png", "Graphics/head_left.png"];
const tailImg = ["Graphics/tail_up.png", "Graphics/tail_down.png", "Graphics/tail_right.png", "Graphics/tail_left.png"];

const snakeEatingImg = ["Graphics/head_up_eating.png", "Graphics/head_down_eating.png", "Graphics/head_right_eating.png", "Graphics/head_left_eating.png"];
const bodyImg = ["Graphics/body_horizontal.png", "Graphics/body_vertical.png"];

//heartbeat animation for apple in score
const heartbeat = document.querySelector('.heartbeat');
const heartecho = document.querySelector('.heartecho');

let nosfx = true;
let nomusic = true;

//sounds
// Create a new Audio object
const music = new Audio("sound/music.mp3")
const eatSound = new Audio('sound/eating.mp3');
const loseSound = new Audio('sound/musicstop.mp3');

const line = document.querySelector(".music div")

//controls show
const control = document.querySelector(".nav-item");
const controls_wrap = document.querySelector(".controls-wrap");

control.addEventListener("click" , () =>{
  controls_wrap.classList.toggle("active");
});

controls_wrap.addEventListener("click" , () => {
  controls_wrap.classList.toggle("active");
})
