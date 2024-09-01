//Display/UI

import { TILE_STATUSES, createBoard, markTile, revealTile, checkWin, checkLose } from "./MineSweeper.js";


const minesLeftText = document.querySelector("[data-mine-count]")

let BOARD_SIZE = 10; // Initialize with default value
let NUMBER_OF_MINES = 3; // Initialize with default value



const boardSizeInput = document.querySelector("#boardSizeInput");
boardSizeInput.addEventListener("input", () => {
    BOARD_SIZE = parseInt(boardSizeInput.value);
});

const numberOfMinesInput = document.querySelector("#numberOfMinesInput");
numberOfMinesInput.addEventListener("input", () => {
    NUMBER_OF_MINES = parseInt(numberOfMinesInput.value);

});
const startGameButton = document.querySelector("#startGameButton");
const boardElement = document.querySelector(".board")
const messageText = document.querySelector(".gameEndText")

//BUGS
// Right click issue? 
// You win if everything is discovered besides the bombs aka no need to right click
// Number of mines need to represent the current on screen amount


function initalizeGame(){
    const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES)

// Clear the board element
    boardElement.innerHTML = "";


    board.forEach(row => {
        row.forEach(tile => {
            boardElement.append(tile.element)
            tile.element.addEventListener("click", () => {
                revealTile(board, tile)
                checkGameEnd(board)
            })
    
            tile.element.addEventListener("contextmenu", e => {
                e.preventDefault()
                markTile(tile)
                listMinesLeft(board)
                
            })
        })
    })
    boardElement.style.setProperty("--size", BOARD_SIZE);

    // Display the number of mines left
    minesLeftText.textContent = NUMBER_OF_MINES;

    
}

startGameButton.addEventListener("click", initalizeGame);


function listMinesLeft(board){
    const markedTilesCount = board.reduce((count, row) => {
        return count + row.filter(tile => tile.status === TILE_STATUSES.MARKED).length; // Change TILE_STATUSES to TILE_STATUSES.MARKED
    }, 0);

    minesLeftText.textContent = NUMBER_OF_MINES - markedTilesCount;

}

function checkGameEnd(board){
    const win = checkWin(board)
    const lose = checkLose(board)

    if(win || lose){
        boardElement.addEventListener("click", stopProp, {capture: true})
        boardElement.addEventListener("contextmenu", stopProp, {capture: true})
    }

    if(win){
        messageText.textContent = "You win :)"
    }
    if(lose){
        messageText.textContent = "You lose :("
        board.forEach(row =>{
            row.forEach(tile => {
                if(tile.TILE_STATUSES === TILE_STATUSES.MARKED) markTile(tile)
                if (tile.mine) revealTile(board, tile)
            })
        })
    }
}


function stopProp(e){
    e.stopImmediatePropagation()
}
