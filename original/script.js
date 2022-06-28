const titleContainerElement = document.querySelector(".title-container");
const gameContainerElement = document.querySelector(".game-container");
const playsFirstSelectElement = document.querySelector(".plays-first");
const startButtonElement = document.querySelector(".start-button");
const exitButtonElement = document.querySelector(".exit-button");
const gridElement = document.querySelector(".grid");
const cellElements = [...document.querySelectorAll(".cell")];
const messageElement = document.querySelector(".message");
let grid = Array(9).fill("");
const PLAYER_CLASS = "x";
const AI_CLASS = "o";
const AI_DELAY = 2000; // (s)
let isPlayerTurn;
let winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

titleContainerElement.classList.add("show");

startButtonElement.addEventListener("click", function() {
    titleContainerElement.classList.remove("show");
    gameContainerElement.classList.add("show");

    isPlayerTurn = playsFirstSelectElement.value === "player";

    cellElements.forEach(cell => { cell.classList.add("show"); });

    handleTurn(null);
});

exitButtonElement.addEventListener("click", function() {
    titleContainerElement.classList.add("show");
    gameContainerElement.classList.remove("show");

    messageElement.innerText = "";
    
    gridElement.classList.remove(PLAYER_CLASS, AI_CLASS);
    cellElements.forEach(cell => { cell.classList.remove(PLAYER_CLASS, AI_CLASS, "show"); });

    grid = Array(9).fill("");
});

function addToGrid(i) {
    if (!isPlayerTurn) {
        cellElements[i].classList.add(PLAYER_CLASS);
        grid[i] = PLAYER_CLASS;
    } else {
        cellElements[i].classList.add(AI_CLASS);
        grid[i] = AI_CLASS;
    }
}

function isGameOver() {
    let isPlayerWin = winningCombinations.some(combination => {
        return combination.every(i => {
            return grid[i] === PLAYER_CLASS;
        });
    });
    if (isPlayerWin) return 1;

    let isAIWin = winningCombinations.some(combination => {
        return combination.every(i => {
            return grid[i] === AI_CLASS;
        });
    });
    if (isAIWin) return 3;

    let isDraw = true;
    for (let i = 0; i < 9; i++) {
        if (!(grid[i] === PLAYER_CLASS || grid[i] === AI_CLASS)) {
            isDraw = false;
            break;
        }
    };
    if (isDraw) return 2;

    return 0; // Game not over
}

function handleGameOver(eval) {
    cellElements.forEach(cell => { cell.removeEventListener("click", handleTurn); });

    if (eval === 1) {
        messageElement.innerText = "Player Won";
    } else if (eval === 2) {
        messageElement.innerText = "Draw";
    } else if (eval === 3) {
        messageElement.innerText = "AI Won";
    }
}

function handleTurn(event) {
    if (event !== null) {
        addToGrid(cellElements.indexOf(event.target));

        let eval = isGameOver();
        if (eval > 0) {  // Game over
            handleGameOver(eval);
            return;
        }
    }

    if (isPlayerTurn) {
        gridElement.classList.add(PLAYER_CLASS);
        for (let i = 0; i < 9; i++) {
            if (!(cellElements[i].classList.contains(PLAYER_CLASS) || cellElements[i].classList.contains(AI_CLASS))) {
                cellElements[i].removeEventListener("click", handleTurn);
                cellElements[i].addEventListener("click", handleTurn);
            }
        }
        messageElement.innerText = "Player Turn...";
        isPlayerTurn = !isPlayerTurn; 
    } else {
        gridElement.classList.remove(PLAYER_CLASS);
        cellElements.forEach(cell => { cell.removeEventListener("click", handleTurn); })
        messageElement.innerText = "AI Turn...";

        let cell = null;
        let maxEval = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (grid[i] === "") {
                grid[i] = AI_CLASS;
                let eval = minimax(-Infinity, Infinity, false);
                grid[i] = "";
                if (eval > maxEval) {
                    cell = cellElements[i];
                    maxEval = eval;
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

function minimax(alpha, beta, maximizingPlayer) {
    let eval = isGameOver();
    if (eval !== 0) {
        return eval;
    }

    if (maximizingPlayer) {
        let maxEval = -Infinity;

        for (let i = 0; i < 9; i++) {
            if (grid[i] === "") {
                grid[i] = AI_CLASS;
                eval = minimax(alpha, beta, false);
                grid[i] = "";
                maxEval = Math.max(maxEval, eval);
                alpha = Math.max(alpha, eval);
                if (beta <= alpha) break;
            }
        }

        return maxEval;
    } else {
        let minEval = Infinity;

        for (let i = 0; i < 9; i++) {
            if (grid[i] === "") {
                grid[i] = PLAYER_CLASS;
                eval = minimax(alpha, beta, true);
                grid[i] = "";
                minEval = Math.min(minEval, eval);
                beta = Math.min(beta, eval);
                if (beta <= alpha) break;
            }
        }

        return minEval;
    }
}