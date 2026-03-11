/**
 * Game Logic Examples and Test Cases
 * Demonstrates how to use the gameLogic functions
 */

import {
  createInitialGameState,
  executeGameTurn,
  validateMove,
  getSubBoardIndex,
  checkWinner,
  getNextActiveSubBoard,
  didPlayerWinSubBoard
} from './gameLogic.js';

// ============================================
// EXAMPLE 1: Creating and starting a game
// ============================================

function exampleInitializeGame() {
  console.log('=== Example 1: Initialize Game ===');
  
  const gameState = createInitialGameState();
  
  console.log('Initial game state:', {
    boardState: gameState.boardState.length + ' cells (all null)',
    subWinners: gameState.subWinners.length + ' sub-boards (all null)',
    macroBoard: gameState.macroBoard.length + ' cells (all null)',
    activeSubBoard: gameState.activeSubBoard + ' (random start)',
    currentTurn: gameState.currentTurn,
    status: gameState.status,
    winner: gameState.winner
  });
  
  return gameState;
}

// ============================================
// EXAMPLE 2: Making a move (Local PvP)
// ============================================

function exampleMakeMoves() {
  console.log('\n=== Example 2: Making Moves ===');
  
  let gameState = createInitialGameState();
  
  // First player has free play (can choose any board)
  console.log(`Active sub-board for player X: ${gameState.activeSubBoard} (null = free play)`);
  
  // Player X makes first move at cell index 4 (any board allowed)
  console.log('\nPlayer X plays at cell index 4...');
  const result1 = executeGameTurn(gameState, 4, null);
  
  if (result1.success) {
    gameState = result1.state;
    console.log('✓ Move successful');
    console.log(`  Next active sub-board: ${gameState.activeSubBoard} (4 % 9 = 4)`);
    console.log(`  Current turn: ${gameState.currentTurn}`);
    console.log(`  Board position [4]: ${gameState.boardState[4]}`);
  }
  
  // Player O now must play in sub-board 4 (determined by X's move at index 4)
  console.log('\nPlayer O plays at cell index 40 (forced to sub-board 4)...');
  const result2 = executeGameTurn(gameState, 40, null);
  
  if (result2.success) {
    gameState = result2.state;
    console.log('✓ Move successful');
    console.log(`  Next active sub-board: ${gameState.activeSubBoard} (40 % 9 = 4)`);
    console.log(`  Current turn: ${gameState.currentTurn}`);
  }
  
  return gameState;
}

// ============================================
// EXAMPLE 3: Sub-board winning scenario
// ============================================

function exampleWinSubBoard() {
  console.log('\n=== Example 3: Winning a Sub-Board ===');
  
  let gameState = createInitialGameState();
  gameState.activeSubBoard = 0; // Override free play - force first move into sub-board 0 for demo
  
  // Simulate Player X getting 3-in-a-row in sub-board 0
  // Cells 0, 1, 2 form top row
  const moves = [
    { index: 0, player: 'X' },  // X at 0
    { index: 10, player: 'O' }, // O at 10 (sub-board 1)
    { index: 1, player: 'X' },  // X at 1 (sub-board 0)
    { index: 19, player: 'O' }, // O at 19 (sub-board 2)
    { index: 2, player: 'X' }   // X at 2 (sub-board 0) - WINS SUB-BOARD 0!
  ];
  
  console.log('Playing sequence to win sub-board 0:');
  for (const move of moves) {
    console.log(`\nMove: ${move.player} at index ${move.index}`);
    const result = executeGameTurn(gameState, move.index, null);
    
    if (result.success) {
      gameState = result.state;
      console.log(`  Sub-winners: [${gameState.subWinners.join(', ')}]`);
      
      if (gameState.awaitingMacroMove) {
        console.log('  🎉 Sub-board won! Awaiting Macro Board move...');
      }
    } else {
      console.log('  ✗ Invalid move:', result.reason);
    }
  }
  
  return gameState;
}

// ============================================
// EXAMPLE 4: Macro Board move (Reward Move)
// ============================================

function exampleMacroMove(gameState) {
  console.log('\n=== Example 4: Macro Board Move ===');
  
  if (!gameState.awaitingMacroMove) {
    console.log('Note: Need a sub-board win first. Using previous example...');
    gameState = exampleWinSubBoard();
  }
  
  console.log(`\nPlayer ${gameState.currentTurn} must place on Macro Board.`);
  console.log(`Choosing cell 0 on Macro Board...`);
  
  // Execute macro move (simplified for example)
  const newMacroBoard = [...gameState.macroBoard];
  newMacroBoard[0] = gameState.currentTurn;
  
  const newState = {
    ...gameState,
    macroBoard: newMacroBoard,
    awaitingMacroMove: false,
    currentTurn: gameState.currentTurn === 'X' ? 'O' : 'X'
  };
  
  console.log('✓ Macro move placed');
  console.log(`  Macro board: [${newMacroBoard.join(', ')}]`);
  console.log(`  Next turn: ${newState.currentTurn}`);
  
  return newState;
}

// ============================================
// EXAMPLE 5: Wildcard Rule (Free Play)
// ============================================

function exampleWildcardRule() {
  console.log('\n=== Example 5: Wildcard Rule ===');
  
  let gameState = createInitialGameState();
  
  // Fill sub-board 0 completely
  for (let i = 0; i < 9; i++) {
    gameState.boardState[i] = i % 2 === 0 ? 'X' : 'O';
  }
  
  console.log('Sub-board 0 is now full (all 9 cells occupied)');
  
  // Player plays at index 8, which normally directs to sub-board 8 % 9 = 8
  // But let's say the next target is 0
  gameState.activeSubBoard = 0;
  
  console.log('\nPlayer wants to play in sub-board 0, but it\'s full!');
  console.log('Result: Wildcard activated - Free play allowed');
  
  const { nextSubBoard, isFree } = getNextActiveSubBoard(8, gameState.boardState, gameState.subWinners);
  
  console.log(`  Next sub-board would be: ${nextSubBoard}`);
  console.log(`  Free play active: ${isFree}`);
  console.log('  Player can now play in ANY non-full sub-board!');
}

// ============================================
// EXAMPLE 6: Move Validation
// ============================================

function exampleMoveValidation() {
  console.log('\n=== Example 6: Move Validation ===');
  
  const gameState = createInitialGameState();
  gameState.activeSubBoard = 0; // Player must play in sub-board 0
  gameState.boardState[0] = 'X'; // Cell 0 is already occupied
  
  // Test case 1: Valid move
  console.log('\nTest 1: Player O plays at index 1 (empty, in active board 0)');
  const valid1 = validateMove(
    1,
    gameState.boardState,
    gameState.activeSubBoard,
    'O',
    gameState.subWinners,
    false
  );
  console.log(`  Result: ${valid1.isValid ? '✓ Valid' : '✗ Invalid - ' + valid1.reason}`);
  
  // Test case 2: Cell already occupied
  console.log('\nTest 2: Player O plays at index 0 (already occupied)');
  const valid2 = validateMove(
    0,
    gameState.boardState,
    gameState.activeSubBoard,
    'O',
    gameState.subWinners,
    false
  );
  console.log(`  Result: ${valid2.isValid ? '✓ Valid' : '✗ Invalid - ' + valid2.reason}`);
  
  // Test case 3: Wrong sub-board
  console.log('\nTest 3: Player O plays at index 15 (in sub-board 1, not 0)');
  const valid3 = validateMove(
    15,
    gameState.boardState,
    gameState.activeSubBoard,
    'O',
    gameState.subWinners,
    false
  );
  console.log(`  Result: ${valid3.isValid ? '✓ Valid' : '✗ Invalid - ' + valid3.reason}`);
  
  // Test case 4: Free play (wildcard)
  console.log('\nTest 4: Same move (index 15) with free play enabled');
  const valid4 = validateMove(
    15,
    gameState.boardState,
    null, // Free play
    'O',
    gameState.subWinners,
    true
  );
  console.log(`  Result: ${valid4.isValid ? '✓ Valid' : '✗ Invalid - ' + valid4.reason}`);
}

// ============================================
// EXAMPLE 7: Win Detection
// ============================================

function exampleWinDetection() {
  console.log('\n=== Example 7: Win Detection ===');
  
  // Test case 1: X wins top row
  const board1 = ['X', 'X', 'X', null, null, null, null, null, null];
  console.log('\nTest 1: Top row filled with X');
  console.log(`  Result: ${checkWinner(board1)}`);
  
  // Test case 2: O wins diagonal
  const board2 = ['O', null, null, null, 'O', null, null, null, 'O'];
  console.log('\nTest 2: Diagonal filled with O');
  console.log(`  Result: ${checkWinner(board2)}`);
  
  // Test case 3: Draw (all full, no winner)
  const board3 = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O'];
  console.log('\nTest 3: All cells full, no winner');
  console.log(`  Result: ${checkWinner(board3)}`);
  
  // Test case 4: Game ongoing
  const board4 = ['X', null, 'O', null, null, null, null, null, null];
  console.log('\nTest 4: Sparse board, game ongoing');
  console.log(`  Result: ${checkWinner(board4) === null ? 'null (ongoing)' : checkWinner(board4)}`);
}

// ============================================
// RUN ALL EXAMPLES
// ============================================

console.log('╔════════════════════════════════════════════════╗');
console.log('║  Ultimate Tic-Tac-Toe - Game Logic Examples  ║');
console.log('╚════════════════════════════════════════════════╝\n');

try {
  // Uncomment to run examples:
  
  // exampleInitializeGame();
  // exampleMakeMoves();
  // exampleWinSubBoard();
  // exampleMacroMove();
  // exampleWildcardRule();
  // exampleMoveValidation();
  // exampleWinDetection();
  
  console.log('\n╔════════════════════════════════════════════════╗');
  console.log('║           Examples completed!                  ║');
  console.log('╚════════════════════════════════════════════════╝');
} catch (error) {
  console.error('Error running examples:', error);
}

// Export for ES module usage
export {
  exampleInitializeGame,
  exampleMakeMoves,
  exampleWinSubBoard,
  exampleMacroMove,
  exampleWildcardRule,
  exampleMoveValidation,
  exampleWinDetection
};
