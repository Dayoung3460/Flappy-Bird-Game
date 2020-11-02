'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector(".grid");
    const doodler = document.createElement('div');
    let doodlerLeftSpace = 50;
    let doodlerBottomSpace = 150;
    let platformCount = 5;
    let isGameOver = false;

    function createDoodler() {
        grid.appendChild(doodler);
        doodler.classList.add('doodler');
        doodler.style.left = doodlerLeftSpace + 'px';
        doodler.style.bottom = doodlerBottomSpace + 'px';
    }

    class Platform {
        constructor(newPlatBottom) {
            this.bottom = newPlatBottom;
            // (grid width=400) - (platfrom width=85)
            this.left = Math.random() * 315;
            this.visual = document.createElement('div');

            const visual = this.visual;
            visual.classList.add('platform');
            visual.style.left = this.left + 'px';
            visual.style.bottom = this.bottom + 'px';
            grid.appendChild(visual);
        }
    }

    function createFlatforms() {
        for(let i=0; i<platformCount; i++) {
            let platGap = 600 / platformCount;
            let newPlatBottom = 60 + i * platGap; 
            let newPlatform = new Platform(newPlatBottom);
        }
    }

    function start() {
        if(!isGameOver) {
            createDoodler();
            createFlatforms();
        }
    }
    start();
})