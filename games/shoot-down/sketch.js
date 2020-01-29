let full_width = 400,
  full_height = 400;
let block_width, block_height;
let player;
let enemies = [];
let direction;
let counter = 0;
let score = 0;
let ammunition = 1;
let max_speed = 10;
let powerup;
let powerupActive = false;
let freezeActive = false;
let extraShotsActive = false;
let powerup_timer = 0;
let oldSpeed = [];
let end = 0;

function setup() {
  full_width = window.innerWidth;
  full_height = window.innerHeight;
  createCanvas(full_width, full_height);
  player = new Player();
  setInterval(newEnemy, 5000);
  setInterval(newPowerup, 10000);
  newEnemy();
}

function draw() {
  counter++;
  background(0);
  checkPowerups();
  player.run();
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].run();
  }
  if (powerupActive == true) {
    powerup.run();
  }
  fill(0, 255, 0);
  noStroke();
  rect(full_width * 0.05, full_height * 0.91, full_width * 0.9 * ammunition, full_height * 0.91);
  fill(255);
  death();
  shotScored();
  clearBalls();
  stroke(255);
  strokeWeight(2);
  line(0, height * 0.9, width, height * 0.9);
  textSize(50);
  text(score, 20, 50);
}

function keyPressed() {
  if (key == " " && end == 1) {
    end = 0;
    enemies.splice(0, enemies.length);
    counter = 0;
    score = 0;
    ammunition = 1;
    player.reset();
    frameRate(60);
    console.log("enemies: " + enemies.length);
  }
}

function checkPowerups() {
  if (freezeActive == true) {
    freeze();
  }
  if (extraShotsActive == true) {
    extraShots();
  }
}

function freeze() {
  powerup_timer--;
  if (powerup_timer == 0) {
    freezeActive = false;
  }
}
function extraShots() {
  powerup_timer--;
  if (powerup_timer == 0) {
    extraShotsActive = false;
  }
}
function nuke() {
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].health = 1;
  }
}

function newEnemy() {
  enemies.push(new Enemy());
}

function newPowerup() {
  if (powerupActive == false) {
    powerup = new Powerup();
  }
}

function powerupPop(effect) {
  powerupActive == false;
  if (effect == 1) {
    freezeActive = true;
    powerup_timer = 300;
  } else if (effect == 2) {
    extraShotsActive = true;
    powerup_timer = 1000;
  } else if (effect == 3) {
    nuke();
  }
}

function death() {
  for (let i = 0; i < enemies.length; i++) {
    distance = sqrt((player.x - enemies[i].x) * (player.x - enemies[i].x) + (player.y - enemies[i].y) * (player.y - enemies[i].y));
    if (distance < enemies[i].width / 2) {
      background(255);
      textSize(width / 10);
      let charWidth = width / 10;
      fill(0);
      text("you lost", (width / 2) - charWidth * 2, height / 2);
      textSize(width / 40);
      text("space to retry", (width / 2) - charWidth, (height / 2) + charWidth / 2);
      end = 1;
      frameRate(0);
    }
  }
  if (powerupActive == true) {
    distance = sqrt((player.x - powerup.x) * (player.x - powerup.x) + (player.y - powerup.y) * (player.y - powerup.y));
    if (distance < powerup.width / 2) {
    background(255);
    textSize(width / 10);
    let charWidth = width / 10;
    fill(0);
    text("you lost", (width / 2) - charWidth * 2, height / 2);
    textSize(width / 40);
    text("space to retry", (width / 2) - charWidth, (height / 2) + charWidth / 2);
    end = 1;
    frameRate(0);
  }
  }
}

function shotScored() {
  for (let i = 0; i < enemies.length; i++) {
    for (let j = 0; j < player.bullets.length; j++) {
      distance = sqrt((player.bullets[j].x - enemies[i].x) * (player.bullets[j].x - enemies[i].x) + (player.bullets[j].y - enemies[i].y) * (player.bullets[j].y - enemies[i].y));
      if (distance <= enemies[i].width / 2) {
        enemies[i].health--;
        player.bullets.splice(j, j + 1);
        score++;
      }
    }
  }
  for (let j = 0; j < player.bullets.length; j++) {
    if (powerupActive == true) {
      distance = sqrt((player.bullets[j].x - powerup.x) * (player.bullets[j].x - powerup.x) + (player.bullets[j].y - powerup.y) * (player.bullets[j].y - powerup.y));
      if (distance <= powerup.width / 2) {
        powerup.hit();
        player.bullets.splice(j, j + 1);
        score++;
      }
    }
  }
}

function clearBalls() {
  for (let i = 0; i < enemies.length; i++) {
    if (enemies[i].health <= 0) {
      enemies.splice(i, i + 1);
      score = score + 50;
    }
  }
}
class Player {
  constructor() {
    this.bullets = [];
    this.x = full_width / 2;
    this.y = full_height - full_height * 0.2;
    this.width = width / 300;
    this.velx = 0;
  }
  run() {
    this.update();
    this.updateBullets();
    this.render();
  }
  noCollision() {
    if (this.x < 0 + abs(this.velx) + this.width) {
      return 1;
    } else if (this.x > width - abs(this.velx)) {
      return 2;
    } else {
      return 0;
    }
  }
  reset() {
    this.x = width / 2;
    this.bullets.splice(0, this.bullets.length);
    this.velx = 0;
  }
  updateBullets() {
    for (let i = 0; i < this.bullets.length; i++) {
      this.bullets[i].run();
      if (this.bullets[i].y < 0) {
        this.bullets.splice(i, i + 1);
      }
    }
  }
  update() {
    if (keyIsDown(65) && this.noCollision() != 1) {
      this.velx = this.velx - 2;
      this.x = this.x + this.velx;
    } else if (keyIsDown(68) && this.noCollision() != 2) {
      this.velx = this.velx + 2;
      this.x = this.x + this.velx;
    } else {
      this.velx = 0;
    }
    if (this.velx < -max_speed) {
      this.velx = -max_speed;
    }
    if (this.velx > max_speed) {
      this.velx = max_speed;
    }
    if (keyIsDown(32)) {
      if (ammunition > 0) {
        this.bullets.push(new Bullet(this.x, this.y));
        this.bullets.push(new Bullet(this.x + width / 200, this.y));
        this.bullets.push(new Bullet(this.x - width / 200, this.y));
        ammunition = ammunition - 0.005;
        if (extraShotsActive == true) {
          ammunition = 1;
          this.bullets.push(new Bullet(this.x + width / 100 , this.y));
          this.bullets.push(new Bullet(this.x - width / 100, this.y));
          this.bullets.push(new Bullet(this.x + width / 50, this.y));
          this.bullets.push(new Bullet(this.x - width / 50, this.y));
        }
      }
    } else {
      if (ammunition <= 0.975) {
        if (ammunition > 0.975) {
          ammunition = ammunition + (1 - ammunition);
        } else {
          ammunition = ammunition + 0.025;
        }
      }
    }
  }
  render() {
    fill(255);
    triangle(this.x, this.y - this.width, this.x + this.width, this.y + this.width, this.x - this.width, this.y + this.width);
  }
}
class Bullet {
  constructor(parent_x, parent_y) {
    this.x = parent_x;
    this.y = parent_y;
  }
  run() {
    this.update();
    this.render();
  }
  update() {
    this.y = this.y - 10;
  }
  render() {
    fill(255);
    rect(this.x, this.y, width / 400, 5);
  }
}
class Enemy {
  constructor() {
    this.vely = 0;
    this.health = int(random(50, 300));
    this.width = this.health * 1.3;
    this.y = height * 0.1;
    this.x = int(random(0 + this.width, full_width - this.width));
    if (this.x > 0) {
      this.velx = -5;
    } else {
      this.velx = 5;
    }
  }
  run() {
    this.update();
    this.render();
  }
  update() {
    if (this.y >= (full_height * 0.9) - this.width / 2 - this.vely) {
      this.vely = this.vely * -1;
      if (abs(this.vely) > 10) {
        this.vely = this.vely * 0.9;
      } else {
        this.vely = this.vely * 1.4;
      }
    }
    if (this.x >= width - this.width / 2 || this.x <= 0 + this.width / 2) {
      this.velx = this.velx * -1;
    }
    if (freezeActive == false) {
      this.x = this.x + this.velx;
      this.y = this.y + this.vely;
      this.vely = this.vely + 0.2;
    } else {
      this.vely = 0;
    }
  }
  render() {
    if (this.health > 50) {
      fill(255, 0, 0);
    } else if (this.health > 25) {
      fill(255, 128, 0);
    } else {
      fill(0, 255, 0);
    }
    if (this.width <= 80) {
      this.width = 80;
    }
    else {
      this.width = this.health * 1.3;
    }
    noStroke();
    circle(this.x, this.y, this.width);
    fill(255);
    textSize(this.width / 2);
    text(this.health, this.x - this.width / 2, this.y + this.width / 4);
  }
}
class Powerup {
  constructor() {
    this.x = random(0, full_width);
    this.y = 0;
    this.width = 50;
    powerupActive = true;
    this.vely = 0;
    this.velx = 5;
    this.hitCount = 0;
    this.active = true;
  }
  run() {
    this.update();
    this.render();
  }
  update() {
    if (this.y >= (full_height * 0.9) - this.width / 2 - this.vely) {
      this.vely = this.vely * -1;
      if (abs(this.vely) > 10) {
        this.vely = this.vely * 0.9;
      } else {
        this.vely = this.vely * 1.6;
      }
    }
    if (this.x >= width || this.x <= 0) {
      this.velx = this.velx * -1;
    }
    this.x = this.x + this.velx;
    this.y = this.y + this.vely;
    this.vely = this.vely + 0.2;
  }
  hit() {
    this.hitCount++;
    this.width = this.width + 3;
    if (this.width >= 200) {
      powerupPop(int(random(1, 4)));
      //powerupPop(3);
      this.active = false;
      powerupActive = false;
    }
  }
  render() {
    fill(255);
    noStroke();
    if (this.active == true) {
      circle(this.x, this.y, this.width);
    }
  }
}
