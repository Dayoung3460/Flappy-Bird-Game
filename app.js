'use strict';

const grid = document.querySelector(".grid");
const startBtn = document.querySelector('button');
grid.appendChild(startBtn);

startBtn.addEventListener("click", () => {
  startBtn.style.display = 'none';
  const doodler = document.createElement("div");
  let doodlerLeftSpace = 50;
  let startPoint = 100;
  let doodlerBottomSpace = startPoint;
  let platformCount = 5;
  let isGameOver = false;
  let platforms = [];
  let upTimerId;
  let downTimerId;
  let isJumping = true;
  let isGoingLeft = false;
  let isGoingRight = false;
  let leftTimerId;
  let rightTimerId;
  let score = 0;

  function createDoodler() {
    grid.appendChild(doodler);
    doodler.classList.add("doodler");
    doodlerLeftSpace = platforms[0].left;
    doodler.style.left = doodlerLeftSpace + "px";
    doodler.style.bottom = doodlerBottomSpace + "px";
  }

  class Platform {
    constructor(newPlatBottom) {
      this.bottom = newPlatBottom;
      // (grid width=400) - (platfrom width=85)
      this.left = Math.random() * 315;
      this.visual = document.createElement("div");

      const visual = this.visual;
      visual.classList.add("platform");
      visual.style.left = this.left + "px";
      visual.style.bottom = this.bottom + "px";
      grid.appendChild(visual);
    }
  }

  function createFlatforms() {
    let platGap = 600 / platformCount;

    for (let i = 0; i < platformCount; i++) {
      // platGap=120
      let newPlatBottom = 60 + i * platGap;
      let newPlatform = new Platform(newPlatBottom);
      platforms.push(newPlatform);
    }
  }

  function movePlatforms() {
    if (doodlerBottomSpace > 100) {
      platforms.forEach((platform) => {
        platform.bottom -= 3;
        let visual = platform.visual;
        visual.style.bottom = platform.bottom + "px";

        if (platform.bottom < 10) {
          let firstPlatform = platforms[0].visual;
          firstPlatform.classList.remove("platform");
          platforms.shift();
          score++;
          let newPlatform = new Platform(600);
          platforms.push(newPlatform);
        }
      });
    }
  }

  function jump() {
    clearInterval(downTimerId);
    isJumping = true;
    upTimerId = setInterval(() => {
      doodlerBottomSpace += 8;
      doodler.style.bottom = doodlerBottomSpace + "px";
      if (doodlerBottomSpace > startPoint + 200) {
        fall();
      }
    }, 30);
  }

  function fall() {
    isJumping = false;
    clearInterval(upTimerId);
    downTimerId = setInterval(() => {
      doodlerBottomSpace -= 5;
      doodler.style.bottom = doodlerBottomSpace + "px";
      if (doodlerBottomSpace <= 0) {
        gameOver();
      }

      platforms.forEach((platform) => {
        if (
          // check if doodler is on the platform
          doodlerBottomSpace >= platform.bottom &&
          // platform height = 15px
          doodlerBottomSpace <= platform.bottom + 15 &&
          // doodler width = 60px
          doodlerLeftSpace + 60 >= platform.left &&
          // platform width = 85px
          doodlerLeftSpace <= platform.left + 85 &&
          !isJumping
        ) {
          startPoint = doodlerBottomSpace;
          jump();
        }
      });
    }, 30);
  }

  function gameOver() {
    isGameOver = true;
    grid.textContent = score;
    clearInterval(upTimerId);
    clearInterval(downTimerId);
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);
  }

  function control(e) {
    if (e.key === "ArrowLeft") {
      moveLeft();
    } else if (e.key === "ArrowRight") {
      moveRight();
    } else if (e.key === "ArrowUp") {
      moveStraight();
    }
  }

  function moveLeft() {
    if (isGoingRight) {
      clearInterval(rightTimerId);
      isGoingRight = false;
    }
    isGoingLeft = true;
    doodler.style.transform = "rotateY(180deg)";
    leftTimerId = setInterval(() => {
      if (doodlerLeftSpace >= 0) {
        doodlerLeftSpace -= 2;
        doodler.style.left = doodlerLeftSpace + "px";
      } else {
        moveRight();
      }
    }, 10);
  }

  function moveRight() {
    if (isGoingLeft) {
      clearInterval(leftTimerId);
      isGoingLeft = false;
    }
    isGoingRight = true;
    doodler.style.transform = "rotateY(0)";
    rightTimerId = setInterval(() => {
      // (grid width 400px) - (doodler width 60px)
      if (doodlerLeftSpace <= 340) {
        doodlerLeftSpace += 2;
        doodler.style.left = doodlerLeftSpace + "px";
      } else {
        moveLeft();
      }
    }, 10);
  }

  function moveStraight() {
    isGoingLeft = false;
    isGoingRight = false;
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);
  }

  function start() {
    if (!isGameOver) {
      createFlatforms();
      createDoodler();
      setInterval(movePlatforms, 30);
      jump();
      document.addEventListener("keyup", control);
    }
  }
  start();
});