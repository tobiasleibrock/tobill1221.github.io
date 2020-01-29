let full_width = 800;
let full_height = 800;
let block_width, block_height;
let head, food;
let direction = "up";
let counter = 0;
let active_food = 0;
let movements = [];
let length = 0;

function setup() {
  frameRate(8);
  createCanvas(full_width, full_height);
  setParameters();
  head = new Head();
  food = new Food();
}

function draw() {
  counter++;
  background(0);
  head.run();
  if (active_food == 1) {
    food.run();
  }
  if (active_food == 0) {
    food = new Food();
  }
}

function collisionCheck() {
  let loss = 0;
  if (head.x >= full_width || head.x <= 0 - block_width || head.y >= full_height || head.y <= 0 - block_height) {
    loss = 1;
  }
  for (let i = 0; i < head.tail.length; i++) {
    if (head.x == head.tail[i].x && head.y == head.tail[i].y) {
      loss = 1; 
    }
  }
  if (loss == 1) {
    fill(255, 0, 0);
    rect(0, 0, full_width, full_height);
    frameRate(0);
  }
}

function keyTyped() {
  if (key === "w" && direction != "down") {
    direction = "up";
  }
  if (key === "a" && direction != "right") {
    direction = "left";
  }
  if (key === "s" && direction != "up") {
    direction = "down";
  }
  if (key === "d" && direction != "left") {
    direction = "right";
  }
}

function setParameters() {
  block_width = full_width / 20;
  block_height = full_height / 20;
}

class Head {
  constructor() {
    this.x = block_width * 10;
    this.y = block_height * 10;
    this.tail = [];
  }
  run() {
    this.update();
    collisionCheck();
    this.render();
    this.runTail();
  }
  update() {
    this.feed();
    this.move();
  }
  feed() {
    if (this.x == food.x && this.y == food.y) {
      active_food = 0;
      length++;
      this.tail.push(new Block(length));
    }
  }
  move() {
    if (direction == "up") {
      this.y = this.y - block_height;
      movements.unshift("up");
    }
    if (direction == "left") {
      this.x = this.x - block_width;
      movements.unshift("left");
    }
    if (direction == "down") {
      this.y = this.y + block_height;
      movements.unshift("down");
    }
    if (direction == "right") {
      this.x = this.x + block_width;
      movements.unshift("right");
    }
    if (movements.length > length + 1) {
      movements.pop();
    }
  }
  render() {
    noStroke();
    fill(255);
    rect(this.x, this.y, block_width, block_height);
  }
  runTail() {
    for (let i = 0; i < this.tail.length; i++) {
      this.tail[i].run();
    }
  }
}

class Block {
  constructor(length) {
    this.spot = length;
    this.pause = this.spot;
    this.x = head.x;
    this.y = head.y;
  }
  run() {
    if (this.pause == 0) {
      this.update();
      this.render();
    } else {
      this.pause--;
    }
  }
  update() {
    if (movements[this.spot] == "up") {
      this.y = this.y - block_height;
    }
    if (movements[this.spot] == "left") {
      this.x = this.x - block_width;
    }
    if (movements[this.spot] == "down") {
      this.y = this.y + block_height;
    }
    if (movements[this.spot] == "right") {
      this.x = this.x + block_width;
    }
  }
  render() {
    fill(0, 255, 0);
    rect(this.x, this.y, block_width, block_height);
  }
}

class Food {
  constructor() {
    this.x = int(random(0, 20)) * block_width;
    this.y = int(random(0, 20)) * block_height;
    active_food = 1;
  }
  run() {
    this.render();
  }
  render() {
    fill(255, 0, 0);
    rect(this.x, this.y, block_width, block_height);
  }




















}