import * as wasm from "wasm-rust";

const titleContainerElement = document.querySelector(".title-container");
const gameContainerElement = document.querySelector(".game-container");
const playsFirstSelectElement = document.querySelector(".plays-first");
const startButtonElement = document.querySelector(".start-button");
const exitButtonElement = document.querySelector(".exit-button");
const gridElement = document.querySelector(".grid");
const cellElements = [...document.querySelectorAll(".cell")];
const messageElement = document.querySelector(".message");
const grid = new wasm.Grid();
const PLAYER_CLASS = "x";
const AI_CLASS = "o";
const PLAYER_ID = 1;
const AI_ID = 2;
const AI_DELAY = 2000; // (s)
let isPlayerTurn;

titleContainerElement.classList.add("show");

startButtonElement.addEventListener("click", function() {
    titleContainerElement.classList.remove("show");
    gameContainerElement.classList.add("show");

    isPlayerTurn = playsFirstSelectElement.value === "player";

    cellElements.forEach(cell => {
        cell.classList.add("show");
    });

    handleTurn(null);
});

exitButtonElement.addEventListener("click", function() {
    titleContainerElement.classList.add("show");
    gameContainerElement.classList.remove("show");

    messageElement.innerText = "";
    gridElement.classList.remove(PLAYER_CLASS, AI_CLASS);
    cellElements.forEach(cell => {
        cell.classList.remove(PLAYER_CLASS, AI_CLASS, "show");
    });

    grid.reset();
});

function addToGrid(i) {
    if (!isPlayerTurn) {
        cellElements[i].classList.add(PLAYER_CLASS);
        grid.set(i, PLAYER_ID);
    } else {
        cellElements[i].classList.add(AI_CLASS);
        grid.set(i, AI_ID);
    }
}

function handleGameOver(evaluation) {
    cellElements.forEach(cell => {
        cell.removeEventListener("click", handleTurn);
    });

    if (evaluation === 1) {
        messageElement.innerText = "Player Won";
    } else if (evaluation === 2) {
        messageElement.innerText = "Draw";
    } else if (evaluation === 3) {
        messageElement.innerText = "AI Won";
    }
}

function handleTurn(event) {
    if (event !== null) {
        addToGrid(cellElements.indexOf(event.target));

        let evaluation = grid.is_game_over()
        if (evaluation > 0) {  // Game over
            handleGameOver(evaluation);
            return;
        }
    }

    if (isPlayerTurn) {
        gridElement.classList.add(PLAYER_CLASS);
        cellElements.forEach(cell => {
            if (!(cell.classList.contains(PLAYER_CLASS) || cell.classList.contains(AI_CLASS))) {
                cell.removeEventListener("click", handleTurn);
                cell.addEventListener("click", handleTurn);
            }
        })
        messageElement.innerText = "Player Turn...";
        isPlayerTurn = !isPlayerTurn; 
    } else {
        gridElement.classList.remove(PLAYER_CLASS);
        cellElements.forEach(cell => { cell.removeEventListener("click", handleTurn); })
        messageElement.innerText = "AI Turn...";

        let cell = null;
        let maxEvaluation = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (grid.get(i) === 0) {
                grid.set(i, AI_ID);
                let evaluation = grid.minimax(0, 4, false);
                console.log(evaluation);
                grid.set(i, 0);
                if (evaluation > maxEvaluation) {
                    cell = cellElements[i];
                    maxEvaluation = evaluation;
                }
            }
        }

        isPlayerTurn = !isPlayerTurn;

        setTimeout(function() {
            cell.addEventListener("click", handleTurn);
            cell.click();
        }, AI_DELAY);
    }
}