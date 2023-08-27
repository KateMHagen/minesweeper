import { useState, useEffect } from "react"

const numRows = 8
const numCols = 8
const numMines = 10

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


function countAdjacentMines(board, row, col) {

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
        // countAdjacentMines(newBoard)
        setBoard(newBoard)
    }, [])

    function revealCell(board, rowIndex,colIndex){
        // Check if row or col index is out of bounds
        if (!(rowIndex < 0 || rowIndex >= numRows || colIndex < 0 || colIndex >= numCols)) {
    
            const cell = board[rowIndex][colIndex]

            if(cell.isMine) {
                gameOver()
            }

            if(!cell.isRevealed) {
                const copy = [...board]

                // If the cell has adjacent mines, only reveal that cell
                if(cell.adjacentMines > 0) {
                    copy[rowIndex][colIndex].isRevealed = true
                    return setBoard(copy)
                }

                // If cell has no adjacent mines, reveal it and recursively reveal neighbours
                //
                //
                //
            }

        }
        return board
    }
    
    return (
        <div className="board">
            {board.map((row, rowIndex) => (
                <div key={rowIndex} className="row">
                    {row.map((col, colIndex) => (
                        <div 
                            key={colIndex} 
                            className={`cell ${board[rowIndex][colIndex].isRevealed ? "revealed" : "notRevealed"}`}
                            // Reveal cell if clicked
                            onClick={() => revealCell(board, rowIndex, colIndex)}
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