import { useState, useEffect } from "react"

const numRows = 8
const numCols = 8
const numMines = 10
// Directions you can go to get to neighbouring cells
let directions = [
    [-1,-1], [-1,0], [-1,1],
    [0,-1], [0,1],
    [1,-1], [1,0], [1,1]
]

function generateEmptyBoard() {
    const board = []
    for(let i = 0; i < numRows; i++) {
        const row = []
        for(let j = 0; j < numCols; j++) {
            row.push({
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                adjacentMines: 0,
            })
        }
        board.push(row)
    }
    return board
}

function placeMines(board) {
    // Randomly place mine on the board
    let minesPlaced = 0
    
    while(minesPlaced < numMines) {
        let randRow =  Math.floor(Math.random() * numRows);
        let randCol =  Math.floor(Math.random() * numCols);
        
        if(!board[randRow][randCol].isMine) {
            board[randRow][randCol].isMine = true
        }
        minesPlaced++
    }
}

function countAdjacentMines(board, rowIndex, colIndex) {
    // Keep a count of the adjacent mines
    let count = 0
 
    for(const [x,y] of directions) {
        let newRow = rowIndex + x
        let newCol = colIndex + y
        
        // Check if neighbor cells are in bounds
        if(newRow >= 0 && newRow < numRows && newCol >= 0 && newCol < numCols) {
            // Check if neighbor cell isMine
            if(board[newRow][newCol].isMine) {
                count++
            }
        }
    }
    return count
}

function gameOver(){
    console.log("Game over")
}

export default function Minesweeper() {
    const [board, setBoard] = useState(generateEmptyBoard())
    
    // Create new board once when component mounts
    useEffect(() => {
        const newBoard = generateEmptyBoard()
        placeMines(newBoard)
        for(let rows = 0; rows < numRows; rows++) {
            for(let cols = 0; cols < numCols; cols++) {
                newBoard[rows][cols].adjacentMines = countAdjacentMines(newBoard, rows, cols)
            }
        }
        setBoard(newBoard)
    }, [])

    function revealCell(board, rowIndex,colIndex) {
        // Check if row or col index is out bounds
        if (rowIndex < 0 || rowIndex >= numRows || colIndex < 0 || colIndex >= numCols) {
            return board;
        }

        let copy = [...board]
        let cell = copy[rowIndex][colIndex]

        if(cell.isMine) {
            cell.isRevealed = true
            setBoard(copy)
            gameOver()
            return board
        }
            
        if(!cell.isRevealed) {
            // If the cell has adjacent mines, only reveal that cell
            if(cell.adjacentMines > 0) {
                cell.isRevealed = true
                return setBoard(copy)
            } 

            // If cell has no adjacent mines, reveal it and recursively reveal neighbours
            cell.isRevealed = true
            setBoard(copy)
            for(const [x, y] of directions) {
                cell.isRevealed = true
                console.log(copy)
                revealCell(copy,rowIndex + x, colIndex + y)
            }
        }
    }
    
    return (
        <div className="board">
            {board.map((row, rowIndex) => (
                <div key={rowIndex} className="row">
                    {row.map((col, colIndex) => (
                        <div 
                            key={colIndex} 
                            // Reveal cell if clicked
                            onClick={() => revealCell(board, rowIndex, colIndex)}
                            className={`cell ${board[rowIndex][colIndex].isRevealed ? "revealed" : "notRevealed"}`}
                            
                            // Flag cell if right clicked
                            //
                            //
                        >
                          
                            {/* display cell content based on the state like how many adjacent mines, if its flagged, if a bomb*/}
                            {board[rowIndex][colIndex].isRevealed ? (board[rowIndex][colIndex].isMine ? "💣" : "") : ""}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}