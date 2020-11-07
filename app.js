'use strict';

const grid = document.querySelector(".grid");
const startBtn = document.querySelector(".start-btn");

grid.appendChild(startBtn);
  
startBtn.addEventListener("click", () => {
  const key = document.querySelector(".arrowKey");
  const direction = document.querySelector(".direction");
  const form = document.querySelector("form");
  const patrick = document.getElementById('character2');
  const sandyCheeks = document.getElementById('character3');
  const doodler = document.createElement("div");
  const level = document.querySelector('.level');
  const lv1 = document.getElementById("lv1");
  const lv2 = document.getElementById('lv2');
  let doodlerLeftSpace = 50;
  let startPoint = 100;
  let doodlerBottomSpace = startPoint;
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

  startBtn.style.display = "none";
  key.style.display = "none";
  direction.style.display = "none";
  form.style.display = "none";
  level.style.display = 'none';

  if (patrick.checked) {
    doodler.style.backgroundImage = "URL('./img/character2.png')";
  } else if (sandyCheeks.checked) {
    doodler.style.backgroundImage = "URL('./img/character3.png')";
  } 

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
    const platformCount = 5;
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
        if(lv1.checked) {
          platform.bottom -= 2;
        } else if(lv2.checked) {
          platform.bottom -= 4;
        } else {
          platform.bottom -= 6;
        }
        
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
      doodlerBottomSpace += 10;
      doodler.style.bottom = doodlerBottomSpace + "px";
      if (doodlerBottomSpace > startPoint + 250) {
        fall();
      }
    }, 30);
  }

  function fall() {
    isJumping = false;
    clearInterval(upTimerId);
    downTimerId = setInterval(() => {
      if(lv1.checked) {
        doodlerBottomSpace -= 5;
      } else if(lv2) {
        doodlerBottomSpace -= 10;
      } else {
        doodlerBottomSpace -= 15;
      }
      
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
    grid.innerHTML = `<h1>GAME OVER</h1>
                      <h3>Your Score<h1>${score}</h1></h3>
                      <div class="game-over-btns">
                        <button class="back-btn">Back</button>
                      </div>
                      `;
    clearInterval(upTimerId);
    clearInterval(downTimerId);
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);

    const backBtn = document.querySelector(".back-btn");
    // var againBtn = document.querySelector('.again-btn')
    backBtn.addEventListener("click", () => window.location.reload());
    // againBtn.addEventListener("click", () => {
    //   isGameOver = false;
    //   start();
    // });
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

    function goLeft(){
      if (doodlerLeftSpace >= 0) {
        doodlerLeftSpace -= 2;
        doodler.style.left = doodlerLeftSpace + "px";
      } else {
        moveRight();
        }
    }
    leftTimerId = setInterval(goLeft, 10);
  }

  function moveRight() {
    if (isGoingLeft) {
      clearInterval(leftTimerId);
      isGoingLeft = false;
    }
    isGoingRight = true;
    doodler.style.transform = "rotateY(0)";

    function goRight(){
     // (grid width 400px) - (doodler width 60px)
      if (doodlerLeftSpace <= 340) {
        doodlerLeftSpace += 2;
        doodler.style.left = doodlerLeftSpace + "px";
      } else {
        moveLeft();
      }
    }
    rightTimerId = setInterval(goRight, 10);
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