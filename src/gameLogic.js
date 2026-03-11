/**
 * Game Logic for Ultimate Tic-Tac-Toe with Macro Board
 * 
 * Board structure:
 * - 81 cells (Micro level): board_state[0-80]
 * - 9 sub-boards (Meso level): groups of 9 cells
 * - 1 macro board (Tier 3): 3x3, tracks sub-board wins
 * 
 * Indexing:
 * Sub-board index: 0-8 (3x3 layout)
 * Cell within sub-board: 0-8 (3x3 layout)
 * Global cell index: (subBoardIndex * 9) + cellIndex
 */

/**
 * Get the sub-board index from a global cell index
 * Global index 0-80 maps to sub-board 0-8
 */
export const getSubBoardIndex = (globalIndex) => Math.floor(globalIndex / 9);

/**
 * Get the cell index within a sub-board
 */
export const getCellIndexInSubBoard = (globalIndex) => globalIndex % 9;

/**
 * Get all global indices for a given sub-board
 */
export const getSubBoardCells = (subBoardIndex) => {
  const start = subBoardIndex * 9;
  return Array.from({ length: 9 }, (_, i) => start + i);
};

/**
 * Convert 2D coordinates (row, col) to sub-board index (0-8)
 */
export const coordsToSubBoardIndex = (row, col) => row * 3 + col;

/**
 * Convert 2D coordinates within a cell to global index
 * cellRow, cellCol: 0-2 (position in 3x3 cell grid)
 * subBoardRow, subBoardCol: 0-2 (position in 3x3 sub-board grid)
 */
export const coordsToGlobalIndex = (cellRow, cellCol, subBoardRow, subBoardCol) => {
  const subBoardIndex = coordsToSubBoardIndex(subBoardRow, subBoardCol);
  const cellIndexInSubBoard = cellRow * 3 + cellCol;
  return subBoardIndex * 9 + cellIndexInSubBoard;
};

/**
 * Check if a player has won in a 3x3 grid (returns 'X', 'O', 'Draw', or null)
 */
export const checkWinner = (board) => {
  // Filter out null values
  if (!board || board.length !== 9) return null;

  // Winning combinations (indices)
  const winCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]              // diagonals
  ];

  for (const [a, b, c] of winCombos) {
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      return board[a]; // 'X' or 'O'
    }
  }

  // Check if board is full (Draw)
  if (board.every(cell => cell !== null)) {
    return 'Draw';
  }

  return null; // Game ongoing
};

/**
 * Check if a sub-board is completely full (all 9 cells have values)
 */
export const isSubBoardFull = (boardState, subBoardIndex) => {
  const cells = getSubBoardCells(subBoardIndex);
  return cells.every(idx => boardState[idx] !== null);
};

/**
 * Get all sub-boards that are not full
 */
export const getPlayableSubBoards = (boardState) => {
  return Array.from({ length: 9 }, (_, i) => i).filter(
    i => !isSubBoardFull(boardState, i)
  );
};

/**
 * Validate a move
 * Returns { isValid: boolean, reason?: string }
 */
export const validateMove = (
  moveIndex,
  boardState,
  activeSubBoard,
  currentPlayer,
  subWinners,
  isFree
) => {
  // Check if moveIndex is valid (0-80)
  if (moveIndex < 0 || moveIndex > 80) {
    return { isValid: false, reason: 'Invalid cell index' };
  }

  // Check if cell is already occupied
  if (boardState[moveIndex] !== null) {
    return { isValid: false, reason: 'Cell already occupied' };
  }

  // Determine which sub-board the move is in
  const moveSubBoard = getSubBoardIndex(moveIndex);

  // If not in free play mode, check if move is in active sub-board
  if (activeSubBoard !== null && !isFree) {
    if (moveSubBoard !== activeSubBoard) {
      return { isValid: false, reason: 'Move must be in active sub-board' };
    }
  }

  // The "Non-Lock" rule: Players can play in won/drawn sub-boards
  // but the move doesn't change sub_winners. No additional validation needed here.

  return { isValid: true };
};

/**
 * Execute a move and return updated state
 */
export const executeMove = (boardState, moveIndex, player) => {
  const newState = [...boardState];
  newState[moveIndex] = player;
  return newState;
};

/**
 * Update sub_winners based on current board state
 * Returns { updated: boolean, winners: array, newWinners: array }
 */
export const updateSubWinners = (boardState, subWinners) => {
  const newWinners = [...subWinners];
  let updated = false;

  for (let i = 0; i < 9; i++) {
    // Skip if already determined
    if (subWinners[i] !== null) continue;

    const cells = getSubBoardCells(i);
    const subBoardState = cells.map(idx => boardState[idx]);
    const winner = checkWinner(subBoardState);

    if (winner !== null) {
      newWinners[i] = winner;
      updated = true;
    }
  }

  return { updated, newWinners };
};

/**
 * Determine the next active sub-board based on the last move
 * Returns { nextSubBoard: number | null, isFree: boolean }
 */
export const getNextActiveSubBoard = (moveIndex, boardState, subWinners) => {
  // The move index modulo 9 determines which sub-board the NEXT player must play in
  const nextSubBoard = moveIndex % 9;

  // Check Wildcard rule: if next sub-board is completely full, it becomes free play
  if (isSubBoardFull(boardState, nextSubBoard)) {
    // Get playable sub-boards
    const playable = getPlayableSubBoards(boardState);
    if (playable.length === 0) {
      // All sub-boards full
      return { nextSubBoard: null, isFree: true };
    }
    return { nextSubBoard: null, isFree: true };
  }

  return { nextSubBoard, isFree: false };
};

/**
 * Check if a player needs to make a Macro Board move
 * (i.e., they just won a sub-board)
 */
export const didPlayerWinSubBoard = (previousSubWinners, currentSubWinners, player) => {
  for (let i = 0; i < 9; i++) {
    if (previousSubWinners[i] === null && currentSubWinners[i] === player) {
      return true;
    }
  }
  return false;
};

/**
 * Place a mark on the Macro Board
 */
export const placeMacroMove = (macroBoard, macroIndex, player) => {
  const newMacro = [...macroBoard];
  if (newMacro[macroIndex] !== null) {
    return { success: false, reason: 'Macro cell already occupied' };
  }
  newMacro[macroIndex] = player;
  return { success: true, newMacro };
};

/**
 * Check overall game winner (from Macro Board)
 */
export const checkMacroWinner = (macroBoard) => {
  return checkWinner(macroBoard); // Same logic as sub-board
};

/**
 * Initialize a fresh board state
 */
export const initializeBoardState = () => {
  return Array(81).fill(null);
};

/**
 * Initialize sub-winners
 */
export const initializeSubWinners = () => {
  return Array(9).fill(null);
};

/**
 * Initialize macro board
 */
export const initializeMacroBoard = () => {
  return Array(9).fill(null);
};

/**
 * Create a fresh game state
 */
export const createInitialGameState = () => {
  return {
    boardState: initializeBoardState(),
    subWinners: initializeSubWinners(),
    macroBoard: initializeMacroBoard(),
    activeSubBoard: null, // Free play for first move - player can choose any board
    currentTurn: 'X',
    winner: null,
    status: 'playing',
    awaitingMacroMove: false, // Flag for Macro Board placement
    lastMoveIndex: null // Store the move that triggered macro requirement
  };
};

/**
 * Simulate a complete game turn (local PvP)
 */
export const executeGameTurn = (
  currentGameState,
  moveIndex,
  macroMoveIndex = null
) => {
  const newState = { ...currentGameState };

  // If a macro move is required and provided, execute ONLY the macro move
  if (newState.awaitingMacroMove && macroMoveIndex !== null) {
    if (newState.macroBoard[macroMoveIndex] !== null) {
      return { success: false, reason: 'Macro cell already occupied', state: newState };
    }
    
    newState.macroBoard = [...newState.macroBoard];
    newState.macroBoard[macroMoveIndex] = newState.currentTurn;
    const macroWinner = checkMacroWinner(newState.macroBoard);
    if (macroWinner && macroWinner !== 'Draw') {
      newState.winner = macroWinner;
      newState.status = 'finished';
    } else if (macroWinner === 'Draw') {
      newState.winner = 'D';
      newState.status = 'finished';
    }
    newState.awaitingMacroMove = false;

    // Determine next sub-board based on the original micro move that won the sub-board
    const { nextSubBoard, isFree } = getNextActiveSubBoard(newState.lastMoveIndex, newState.boardState, newState.subWinners);
    newState.activeSubBoard = nextSubBoard;
    newState.lastMoveIndex = null; // Clear the stored move index

    // Switch turn
    newState.currentTurn = newState.currentTurn === 'X' ? 'O' : 'X';
    return { success: true, state: newState };
  }

  // Execute micro move
  const validation = validateMove(
    moveIndex,
    newState.boardState,
    newState.activeSubBoard,
    newState.currentTurn,
    newState.subWinners,
    newState.activeSubBoard === null
  );

  if (!validation.isValid) {
    return { success: false, reason: validation.reason, state: newState };
  }

  // Place the move
  newState.boardState = executeMove(newState.boardState, moveIndex, newState.currentTurn);

  // Update sub-winners
  const { updated: subWinnerUpdated, newWinners } = updateSubWinners(
    newState.boardState,
    newState.subWinners
  );
  
  if (subWinnerUpdated) {
    newState.subWinners = newWinners;

    // Check if player won a sub-board
    const playerWon = didPlayerWinSubBoard(currentGameState.subWinners, newState.subWinners, newState.currentTurn);
    if (playerWon) {
      newState.awaitingMacroMove = true;
      newState.lastMoveIndex = moveIndex; // Store the move that triggered macro requirement
    }
  }

  // If we don't immediately need a macro move, progress normally
  if (!newState.awaitingMacroMove) {
    const { nextSubBoard, isFree } = getNextActiveSubBoard(moveIndex, newState.boardState, newState.subWinners);
    newState.activeSubBoard = nextSubBoard;

    // Switch turn
    newState.currentTurn = newState.currentTurn === 'X' ? 'O' : 'X';
  }

  return { success: true, state: newState };
};
