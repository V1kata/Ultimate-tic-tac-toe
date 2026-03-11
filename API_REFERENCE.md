# 📚 API Reference - Ultimate Tic-Tac-Toe

Complete documentation of all exported functions and components.

---

## `gameLogic.js` - Core Game Logic

### Board State Functions

#### `getSubBoardIndex(globalIndex) → number`

Convert a global cell index (0-80) to its sub-board index (0-8).

```javascript
getSubBoardIndex(24)  // → 2 (cells 18-26 are in sub-board 2)
getSubBoardIndex(0)   // → 0
getSubBoardIndex(80)  // → 8
```

**Returns:** Sub-board index 0-8

---

#### `getCellIndexInSubBoard(globalIndex) → number`

Get the position of a cell within its sub-board (0-8).

```javascript
getCellIndexInSubBoard(24)  // → 6 (24 in sub-board 2 is at index 6)
getCellIndexInSubBoard(0)   // → 0
```

**Returns:** Index within sub-board 0-8

---

#### `getSubBoardCells(subBoardIndex) → number[]`

Get all global cell indices belonging to a sub-board.

```javascript
getSubBoardCells(0)   // → [0,1,2,3,4,5,6,7,8]
getSubBoardCells(4)   // → [36,37,38,39,40,41,42,43,44]
getSubBoardCells(8)   // → [72,73,74,75,76,77,78,79,80]
```

**Returns:** Array of 9 global indices

---

#### `coordsToSubBoardIndex(row, col) → number`

Convert 2D coordinates to sub-board index.

```javascript
coordsToSubBoardIndex(0, 0)  // → 0  (top-left)
coordsToSubBoardIndex(1, 1)  // → 4  (center)
coordsToSubBoardIndex(2, 2)  // → 8  (bottom-right)
```

**Returns:** Sub-board index 0-8

---

#### `coordsToGlobalIndex(cellRow, cellCol, sbRow, sbCol) → number`

Convert cell coordinates and sub-board position to global index.

```javascript
// Center cell in center sub-board
coordsToGlobalIndex(1, 1, 1, 1)  // → 40

// Top-left cell in top-left sub-board
coordsToGlobalIndex(0, 0, 0, 0)  // → 0

// Bottom-right cell in bottom-right sub-board
coordsToGlobalIndex(2, 2, 2, 2)  // → 80
```

**Parameters:**
- `cellRow`, `cellCol` - Position within 3x3 cell (0-2)
- `sbRow`, `sbCol` - Sub-board position in 3x3 grid (0-2)

**Returns:** Global cell index 0-80

---

### Game State Functions

#### `checkWinner(board) → 'X' | 'O' | 'Draw' | null`

Check if a 3x3 grid (9 cells) has a winner.

```javascript
const fullBoard = ['X', 'X', 'X', 'O', null, null, null, null, null];
checkWinner(fullBoard)  // → 'X'

const emptyBoard = Array(9).fill(null);
checkWinner(emptyBoard)  // → null

const fullNoWinner = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O'];
checkWinner(fullNoWinner)  // → 'Draw'
```

**Parameter:** Array of exactly 9 elements (null, 'X', or 'O')

**Returns:** 'X', 'O', 'Draw', or null (game ongoing)

---

#### `isSubBoardFull(boardState, subBoardIndex) → boolean`

Check if a sub-board has all 9 cells filled (triggers Wildcard Rule).

```javascript
const state = Array(81).fill('X');  // All cells filled
isSubBoardFull(state, 0)  // → true

const empty = Array(81).fill(null);
isSubBoardFull(empty, 0)  // → false
```

**Returns:** `true` if all 9 cells in sub-board are occupied

---

#### `getPlayableSubBoards(boardState) → number[]`

Get list of sub-boards that aren't completely full.

```javascript
const state = Array(81).fill(null);
state[0] = 'X';  // Only first cell filled

getPlayableSubBoards(state)  // → [0,1,2,3,4,5,6,7,8] (all playable)
```

**Returns:** Array of playable sub-board indices (0-8)

---

### Validation & Movement

#### `validateMove(moveIndex, boardState, activeSubBoard, currentPlayer, subWinners, isFree) → {isValid, reason?}`

Validate if a move is legal.

```javascript
const gameState = createInitialGameState();

const result = validateMove(
  4,                              // Cell index 0-80
  gameState.boardState,
  gameState.activeSubBoard,
  'X',
  gameState.subWinners,
  false                           // Not free play
);

if (result.isValid) {
  // Legal move
} else {
  console.log(result.reason);   // "Move must be in active sub-board"
}
```

**Parameters:**
- `moveIndex` - Cell to play (0-80)
- `boardState` - Current board
- `activeSubBoard` - Required sub-board (null = free play)
- `currentPlayer` - 'X' or 'O'
- `subWinners` - Array of sub-board winners
- `isFree` - Is free play active?

**Returns:** `{isValid: boolean, reason?: string}`

---

#### `executeMove(boardState, moveIndex, player) → cell[]`

Place a mark on the board (doesn't validate).

```javascript
let board = Array(81).fill(null);
board = executeMove(board, 4, 'X');
console.log(board[4])  // → 'X'
```

**Returns:** New board state array

---

#### `getNextActiveSubBoard(moveIndex, boardState, subWinners) → {nextSubBoard: number|null, isFree: boolean}`

Determine the active sub-board for the next player.

```javascript
// Player played at index 24
const result = getNextActiveSubBoard(24, boardState, subWinners);

// nextSubBoard = 24 % 9 = 6 (normal case)
// OR if sub-board 6 is full:
// nextSubBoard = null, isFree = true (Wildcard Rule!)
```

**Returns:** 
- `nextSubBoard` - Required sub-board (0-8) or null for free play
- `isFree` - true if Wildcard Rule triggered

---

### Sub-Board & Macro Logic

#### `updateSubWinners(boardState, subWinners) → {updated, newWinners}`

Update sub-board winners based on current board state.

```javascript
const winners = updateSubWinners(boardState, currentWinners);

if (winners.updated) {
  subWinners = winners.newWinners;
}
```

**Returns:**
- `updated` - true if any winner changed
- `newWinners` - Updated winners array

---

#### `didPlayerWinSubBoard(prevWinners, currentWinners, player) → boolean`

Check if player just won a sub-board.

```javascript
const justWon = didPlayerWinSubBoard(
  oldSubWinners,    // Previous state
  newSubWinners,    // After move
  'X'               // Player
);

if (justWon) {
  // Player gets Reward Move on Macro Board!
}
```

**Returns:** true if player won a new sub-board

---

#### `placeMacroMove(macroBoard, macroIndex, player) → {success, newMacro?, reason?}`

Place a mark on the Macro Board.

```javascript
const result = placeMacroMove(macroBoard, 0, 'X');

if (result.success) {
  macroBoard = result.newMacro;
} else {
  console.log(result.reason);  // "Macro cell already occupied"
}
```

**Returns:** 
- `success` - true if move was placed
- `newMacro` - Updated macro board (if successful)
- `reason` - Error message (if failed)

---

#### `checkMacroWinner(macroBoard) → 'X' | 'O' | 'Draw' | null`

Check if someone won the game via Macro Board.

```javascript
const macroBoard = ['X', 'X', 'X', null, null, null, null, null, null];

checkMacroWinner(macroBoard)  // → 'X' (game won!)
```

**Returns:** 'X', 'O', 'Draw', or null

---

### Game Initialization

#### `initializeBoardState() → null[]`

Create a fresh 81-cell board (all empty).

```javascript
const board = initializeBoardState();
console.log(board.length)  // → 81
console.log(board[0])      // → null
```

**Returns:** Array of 81 null values

---

#### `initializeSubWinners() → null[]`

Create empty sub-winners tracker (9 slots).

```javascript
const winners = initializeSubWinners();
console.log(winners.length)  // → 9
```

**Returns:** Array of 9 null values

---

#### `initializeMacroBoard() → null[]`

Create empty Macro Board (9 slots).

```javascript
const macro = initializeMacroBoard();
console.log(macro.length)  // → 9
```

**Returns:** Array of 9 null values

---

#### `createInitialGameState() → gameState`

Create a complete, ready-to-play game state.

```javascript
const game = createInitialGameState();

// Returns:
{
  boardState: [... 81 cells ...],
  subWinners: [... 9 values ...],
  macroBoard: [... 9 cells ...],
  activeSubBoard: null,             // Free play - first player can choose any board
  currentTurn: 'X',
  winner: null,
  status: 'playing',
  awaitingMacroMove: false
}
```

**Returns:** Ready-to-play game state object

---

### Full Game Loop

#### `executeGameTurn(currentGameState, moveIndex, macroMoveIndex) → {success, state?, reason?}`

Execute a complete game turn (micro + macro moves if applicable).

```javascript
let game = createInitialGameState();

// Player X makes move at cell 4
const result = executeGameTurn(game, 4, null);

if (result.success) {
  game = result.state;  // Updated state
  
  if (game.awaitingMacroMove) {
    // Next: must call executeGameTurn with macroMoveIndex
  }
} else {
  console.log(result.reason);  // Invalid move
}
```

**Parameters:**
- `currentGameState` - Current game state
- `moveIndex` - Micro move (0-80)
- `macroMoveIndex` - Macro move (0-8) optional

**Returns:**
- `success` - true if move executed
- `state` - Updated game state
- `reason` - Error message (if failed)

---

## `supabaseClient.js` - Database Integration

### Game CRUD Operations

#### `createGame(gameData) → game`

Create a new game in the database.

```javascript
const newGame = await createGame({
  board_state: Array(81).fill(null),
  sub_winners: Array(9).fill(null),
  macro_board: Array(9).fill(null),
  active_sub_board: 0,
  current_turn: 'X',
  winner: null,
  status: 'playing'
});

// Returns: { id: 'uuid', ...rest of data }
const gameId = newGame.id;
```

---

#### `getGame(gameId) → game`

Fetch a game by ID.

```javascript
const game = await getGame('12345678-1234-1234-1234-123456789012');

// Returns full game object with all fields
```

**Throws:** Error if game not found

---

#### `updateGame(gameId, updates) → game`

Update an existing game.

```javascript
const updated = await updateGame(gameId, {
  board_state: newBoardState,
  current_turn: 'O',
  winner: null
});

// Returns updated game object
```

---

#### `deleteGame(gameId) → void`

Delete a game from the database.

```javascript
await deleteGame(gameId);
// Game is removed
```

**Throws:** Error if deletion fails

---

#### `getGamesByStatus(status) → game[]`

Get all games with a specific status.

```javascript
const playingGames = await getGamesByStatus('playing');
const finishedGames = await getGamesByStatus('finished');

// Returns array of matching games
```

**Valid statuses:** 'waiting', 'playing', 'finished'

---

### Real-time Synchronization

#### `subscribeToGameUpdates(gameId, callback) → unsubscribe`

Subscribe to real-time game updates using Supabase Realtime.

```javascript
const unsubscribe = subscribeToGameUpdates(
  gameId,
  (updatedGame) => {
    console.log('Game updated:', updatedGame);
    // Auto-sync UI with new game state
    setGameState(updatedGame);
  }
);

// Later: unsubscribe from updates
unsubscribe();
```

**Parameters:**
- `gameId` - UUID of game to monitor
- `callback` - Function called when game updates

**Returns:** Unsubscribe function

**Events:** Triggered on UPDATE operations in database

---

## React Components - UI

### `<GameBoard />`

Main game board display (3x3 grid of sub-boards).

```jsx
<GameBoard
  boardState={game.boardState}              // 81-cell array
  subWinners={game.subWinners}              // 9-cell array
  activeSubBoard={game.activeSubBoard}      // 0-8 or null
  onCellClick={(index) => handleMove(index)} // Move handler
  gameFinished={game.status === 'finished'} // Disable if done
/>
```

**Props:**
- `boardState` - All 81 cell values (null/'X'/'O')
- `subWinners` - Winners of each sub-board
- `activeSubBoard` - Highlighted sub-board (or null for free play)
- `onCellClick` - Callback when cell clicked
- `gameFinished` - If true, disables clicks

---

### `<MacroBoard />`

Macro board sidebar showing sub-board wins and allowing macro moves.

```jsx
<MacroBoard
  macroBoard={game.macroBoard}              // 9-cell array
  subWinners={game.subWinners}             // Reference info
  onCellClick={(index) => handleMacroMove(index)}
  disabled={!game.awaitingMacroMove}
/>
```

**Props:**
- `macroBoard` - Current macro board state
- `subWinners` - Sub-board winners (for reference)
- `onCellClick` - Callback for macro moves
- `disabled` - Disable if not awaiting macro move

---

### `<GameInfo />`

Status panel showing game state and turn information.

```jsx
<GameInfo
  gameMode="local"                    // 'local' or 'online'
  currentPlayer={game.currentTurn}    // 'X' or 'O'
  status={game.status}                // 'playing' or 'finished'
  winner={game.winner}                // Winner or null
  awaitingMacroMove={game.awaitingMacroMove}
  gameLink={generateLink()}
  onCopyLink={copyToClipboard}
/>
```

---

### `<ModeSelector />`

Mode selection screen with buttons for Local PvP and Online Play.

```jsx
<ModeSelector
  onLocalPvP={() => startLocalGame()}
  onOnlineHost={() => startOnlineGame()}
  onOnlineJoin={(gameId, playerId) => joinGame(gameId, playerId)}
/>
```

---

### `<WinnerModal />`

Victory or draw announcement modal.

```jsx
<WinnerModal
  winner="X"           // 'X', 'O', or 'D' for draw
  onClose={() => resetGame()}
/>
```

---

## Data Models

### Game State Object

```javascript
{
  boardState: [null|'X'|'O', ...],   // 81 cells
  subWinners: [null|'X'|'O'|'Draw', ...], // 9 values
  macroBoard: [null|'X'|'O', ...],   // 9 cells
  activeSubBoard: 0-8 | null,        // Current required board
  currentTurn: 'X' | 'O',
  winner: null | 'X' | 'O' | 'D',
  status: 'waiting' | 'playing' | 'finished',
  awaitingMacroMove: boolean
}
```

### Database Game Record

```javascript
{
  id: uuid,                    // Primary key
  board_state: jsonb,          // 81-cell array
  sub_winners: jsonb,          // 9-winner array
  macro_board: jsonb,          // 9-cell macro board
  active_sub_board: int,       // 0-8 or null
  current_turn: char,          // 'X' or 'O'
  winner: char,                // null, 'X', 'O', 'D'
  status: text,                // 'waiting', 'playing', 'finished'
  created_at: timestamp,
  updated_at: timestamp
}
```

---

## Complete Example: Making a Move

```javascript
// 1. Validate the move
const validation = validateMove(
  moveIndex,
  gameState.boardState,
  gameState.activeSubBoard,
  gameState.currentTurn,
  gameState.subWinners,
  gameState.activeSubBoard === null
);

if (!validation.isValid) {
  console.error(validation.reason);
  return;
}

// 2. Execute the complete turn
const result = executeGameTurn(gameState, moveIndex, null);

if (!result.success) {
  console.error(result.reason);
  return;
}

// 3. Update local state
let newGameState = result.state;

// 4. Check if macro move needed
if (newGameState.awaitingMacroMove) {
  // Prompt for macro move
  const macroResult = executeGameTurn(newGameState, moveIndex, macroIndex);
  if (macroResult.success) {
    newGameState = macroResult.state;
  }
}

// 5. Update database (if online)
if (gameMode === 'online') {
  await updateGame(gameId, {
    board_state: newGameState.boardState,
    sub_winners: newGameState.subWinners,
    macro_board: newGameState.macroBoard,
    active_sub_board: newGameState.activeSubBoard,
    current_turn: newGameState.currentTurn,
    winner: newGameState.winner,
    status: newGameState.status
  });
}

// 6. Update UI
setGameState(newGameState);
```

---

## Constants & Special Values

```javascript
// Board indices
SUB_BOARD_COUNT = 9
CELLS_PER_SUB_BOARD = 9
TOTAL_CELLS = 81

// Cell values
EMPTY = null
PLAYER_X = 'X'
PLAYER_O = 'O'

// Game status
STATUS_WAITING = 'waiting'
STATUS_PLAYING = 'playing'
STATUS_FINISHED = 'finished'

// Special rules
WILDCARD_ACTIVE = activeSubBoard === null
ALLOW_NON_LOCK_PLAY = true  // Always allowed in this implementation
```

---

## Examples & Patterns

### Pattern: Start a Local Game

```javascript
const gameState = createInitialGameState();
// Game is ready to play!
```

### Pattern: Make a Move

```javascript
const result = executeGameTurn(currentState, cellIndex, null);
if (result.success) {
  setState(result.state);
}
```

### Pattern: Check for Winner

```javascript
const gameWinner = checkMacroWinner(gameState.macroBoard);
if (gameWinner === 'X') {
  // Player X won!
}
```

### Pattern: Real-time Multiplayer

```javascript
useEffect(() => {
  const unsubscribe = subscribeToGameUpdates(gameId, (updated) => {
    setGameState(updated);
  });
  return () => unsubscribe();
}, [gameId]);
```

---

This API reference covers all public functions and React components used in the application.
