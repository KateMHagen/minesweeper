import { useState, useEffect } from "react"

const numRows = 8
const numCols = 8
const numMines = 10
let cellUsedCount = 0
let cellsFlagged = 0
// Directions you can go to get to neighbouring cells
let directions = [
    [-1,-1], [-1,0], [-1,1], // [up, left], [up, same], [up, right]
    [0,-1], [0,1],           // [same, left], [same, right]
    [1,-1], [1,0], [1,1]     // [down,left], [down, same], [down, right]
]

export default function Minesweeper() {
    const [board, setBoard] = useState(generateEmptyBoard())
    const [isGameOver, setIsGameOver] = useState(false)
    const [isGameWon, setIsGameWon] = useState(false)
    
    // Create new game/board once when component mounts
    useEffect(() => {
        newGame()
    }, [])

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

    function newGame() {
        cellsFlagged = 0
        cellUsedCount = 0
        setIsGameOver(false)
        setIsGameWon(false)
        const newBoard = generateEmptyBoard()
        placeMines(newBoard)
        for(let rows = 0; rows < numRows; rows++) {
            for(let cols = 0; cols < numCols; cols++) {
                newBoard[rows][cols].adjacentMines = countAdjacentMines(newBoard, rows, cols)
            }
        }
        setBoard(newBoard)
    }

    function placeMines(board) {
        // Randomly place mine on the board
        let minesPlaced = 0
        
        while(minesPlaced < numMines) {
            let randRow =  Math.floor(Math.random() * numRows);
            let randCol =  Math.floor(Math.random() * numCols);
            
            if(!board[randRow][randCol].isMine) {
                board[randRow][randCol].isMine = true
                minesPlaced++
            }
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
            setIsGameOver(true)
            return board
        }

        if(!cell.isRevealed) {
            cellUsedCount++
            // If cells used are 64 and cells flagged are 10, then user won game
            if(cellUsedCount === 64 && cellsFlagged == 10) {
                setIsGameWon(true)
            }

            if(!cell.isFlagged){
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
                    revealCell(copy,rowIndex + x, colIndex + y)
                }
            }
        }
    }

    function flag(board, rowIndex, colIndex) {
        let copy = [...board]
        let cell = copy[rowIndex][colIndex]
        
        if(cell.isFlagged) {
            cell.isFlagged = false
            cellUsedCount--
            cellsFlagged--
        } else {
            cell.isFlagged = true
            cellUsedCount++
            cellsFlagged++
            // If cells used are 64 and cells flagged are 10, then user won game
            if(cellUsedCount === 64 && cellsFlagged == 10) {
                setIsGameWon(true)
            }
        }
        return setBoard(copy)
    }

    function displayCell(board, rowIndex, colIndex){
        const cell = board[rowIndex][colIndex]
        
        if(cell.isRevealed){
            if(cell.isMine){
                return "💣"
            } else if(cell.adjacentMines === 0) {
                return ""
            } else {
                return cell.adjacentMines
            }
        } else if (cell.isFlagged) {
            return "⛳️"
        }
        
        if(isGameOver){
            if(cell.isMine){
                return "💣"
            }
        } 
    }

    return (
        <div className="container">
            <button className="hello" onClick={newGame}>{isGameOver ? "sad face" : "happy face"}</button>
            <div className={`${isGameWon ? "win" : "not-win"}`}>YOU WON!!</div>
            <div className="board">
                {board.map((row, rowIndex) => (
                    <div key={rowIndex} className="row">
                        {row.map((col, colIndex) => (
                            <div 
                                key={colIndex} 
                                // Reveal cell if clicked
                                onClick={!isGameOver ? () => revealCell(board, rowIndex, colIndex) : () => setIsGameOver(true)}
                                onContextMenu={(e) => {
                                    e.preventDefault()
                                    !isGameOver ? flag(board, rowIndex, colIndex) : setIsGameOver(true)
                                }}
                                className={`
                                    cell 
                                    ${board[rowIndex][colIndex].isRevealed ? "revealed" : "notRevealed"} 
                                    ${board[rowIndex][colIndex].isFlagged ? "flagged" : "notRevealed"}
                                `}
                            >
                                {displayCell(board,rowIndex,colIndex, cellUsedCount)}
                            </div>
                        ))}
                    </div>
                ))}
            </div>  
        </div>
    )
}