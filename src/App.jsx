import React, { useState, useEffect } from 'react';
import {
  createInitialGameState,
  executeGameTurn,
  checkMacroWinner,
  getSubBoardIndex,
  getSubBoardCells,
  didPlayerWinSubBoard
} from './gameLogic';
import {
  createGame,
  getGame,
  updateGame,
  subscribeToGameUpdates
} from './supabaseClient';
import GameBoard from './components/GameBoard';
import MacroBoard from './components/MacroBoard';
import GameInfo from './components/GameInfo';
import ModeSelector from './components/ModeSelector';
import WinnerModal from './components/WinnerModal';

export default function App() {
  const [gameMode, setGameMode] = useState(null); // 'local' or 'online'
  const [gameState, setGameState] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [currentPlayerId, setCurrentPlayerId] = useState(null);
  const [gameLink, setGameLink] = useState(null);
  const [showWinner, setShowWinner] = useState(false);
  const [winner, setWinner] = useState(null);

  // Initialize local game
  const startLocalGame = () => {
    const initialState = createInitialGameState();
    setGameState(initialState);
    setGameMode('local');
    setCurrentPlayerId('X');
  };

  // Initialize online game
  const startOnlineGame = async (isHost = true) => {
    try {
      if (isHost) {
        const initialState = createInitialGameState();
        const game = await createGame({
          board_state: initialState.boardState,
          sub_winners: initialState.subWinners,
          macro_board: initialState.macroBoard,
          active_sub_board: initialState.activeSubBoard,
          current_turn: 'X',
          winner: null,
          last_move_index: initialState.lastMoveIndex,
          status: 'playing'
        });

        setGameId(game.id);
        setGameState(initialState);
        setGameMode('online');
        setCurrentPlayerId('X');

        const url = `${window.location.origin}?gameId=${game.id}&playerId=O`;
        setGameLink(url);
      }
    } catch (error) {
      console.error('Error creating online game:', error);
      alert('Failed to create online game. Check Supabase configuration.');
    }
  };

  // Join online game
  const joinOnlineGame = async (joinGameId, playerId) => {
    try {
      const game = await getGame(joinGameId);
      setGameState({
        boardState: game.board_state,
        subWinners: game.sub_winners,
        macroBoard: game.macro_board,
        activeSubBoard: game.active_sub_board,
        currentTurn: game.current_turn,
        winner: game.winner,
        status: game.status,
        awaitingMacroMove: game.last_move_index !== null && game.last_move_index !== undefined,
        lastMoveIndex: game.last_move_index
      });
      setGameId(joinGameId);
      setGameMode('online');
      setCurrentPlayerId(playerId);
    } catch (error) {
      console.error('Error joining game:', error);
      alert('Failed to join game.');
    }
  };

  // Subscribe to real-time updates
  useEffect(() => {
    if (gameMode === 'online' && gameId) {
      const unsubscribe = subscribeToGameUpdates(gameId, (updatedGame) => {
        const newState = {
          boardState: updatedGame.board_state,
          subWinners: updatedGame.sub_winners,
          macroBoard: updatedGame.macro_board,
          activeSubBoard: updatedGame.active_sub_board,
          currentTurn: updatedGame.current_turn,
          winner: updatedGame.winner,
          status: updatedGame.status,
          awaitingMacroMove: updatedGame.last_move_index !== null && updatedGame.last_move_index !== undefined,
          lastMoveIndex: updatedGame.last_move_index
        };
        setGameState(newState);
        
        if (updatedGame.winner) {
          setShowWinner(true);
          setWinner(updatedGame.winner);
        }
      });

      return () => unsubscribe();
    }
  }, [gameMode, gameId]);

  // Handle micro move
  const handleMove = (cellIndex) => {
    if (!gameState || gameState.status === 'finished') return;

    // In online mode, only allow current player to move
    if (gameMode === 'online' && currentPlayerId !== gameState.currentTurn) {
      alert('Not your turn!');
      return;
    }

    if (gameState.awaitingMacroMove) {
      alert('You must place a mark on the Macro Board first!');
      return;
    }

    const result = executeGameTurn(
      gameState,
      cellIndex,
      null
    );

    if (result.success) {
      const newState = result.state;
      setGameState(newState);

      // Update database if online
      if (gameMode === 'online') {
        updateGame(gameId, {
          board_state: newState.boardState,
          sub_winners: newState.subWinners,
          macro_board: newState.macroBoard,
          active_sub_board: newState.activeSubBoard,
          current_turn: newState.currentTurn,
          winner: newState.winner,
          status: newState.status,
          last_move_index: newState.lastMoveIndex
        });
      }

      if (newState.winner) {
        setShowWinner(true);
        setWinner(newState.winner);
      }
    } else {
      alert(result.reason || 'Invalid move');
    }
  };

  // Handle macro move
  const handleMacroMove = (macroIndex) => {
    if (!gameState || !gameState.awaitingMacroMove) return;

    // In online mode, only allow current player
    if (gameMode === 'online' && currentPlayerId !== gameState.currentTurn) {
      alert('Not your turn!');
      return;
    }

    if (gameState.macroBoard[macroIndex] !== null) {
      alert('Macro cell already occupied!');
      return;
    }

    // Use executeGameTurn with the stored lastMoveIndex and macroMoveIndex
    const result = executeGameTurn(
      gameState,
      gameState.lastMoveIndex, // Use the stored move index that triggered macro requirement
      macroIndex // The macro board cell index
    );

    if (result.success) {
      const newState = result.state;
      setGameState(newState);

      // Update database if online
      if (gameMode === 'online') {
        updateGame(gameId, {
          macro_board: newState.macroBoard,
          active_sub_board: newState.activeSubBoard,
          current_turn: newState.currentTurn,
          winner: newState.winner,
          status: newState.status,
          last_move_index: newState.lastMoveIndex
        });
      }

      if (newState.winner) {
        setShowWinner(true);
        setWinner(newState.winner);
      }
    } else {
      alert(result.reason || 'Invalid macro move');
    }
  };

  // Copy game link to clipboard
  const copyGameLink = () => {
    if (gameLink) {
      navigator.clipboard.writeText(gameLink).then(() => {
        alert('Game link copied to clipboard!');
      });
    }
  };

  // Reset game
  const resetGame = () => {
    setGameState(null);
    setGameMode(null);
    setGameId(null);
    setCurrentPlayerId(null);
    setGameLink(null);
    setShowWinner(false);
    setWinner(null);
  };

  if (!gameMode) {
    return (
      <ModeSelector
        onLocalPvP={startLocalGame}
        onOnlineHost={() => startOnlineGame(true)}
        onOnlineJoin={joinOnlineGame}
      />
    );
  }

  if (!gameState) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-light text-2xl">Loading game...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-light p-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Ultimate Tic-Tac-Toe</h1>
          <p className="text-light/70">with Macro Board & Strategic Lock</p>
        </header>

        <GameInfo
          gameMode={gameMode}
          currentPlayer={gameState.currentTurn}
          status={gameState.status}
          winner={winner}
          awaitingMacroMove={gameState.awaitingMacroMove}
          gameLink={gameLink}
          onCopyLink={copyGameLink}
        />

        <div className="flex sm:flex-row flex-col gap-8 mt-8">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4">Game Board</h2>
              <GameBoard
                boardState={gameState.boardState}
                subWinners={gameState.subWinners}
                activeSubBoard={gameState.activeSubBoard}
                onCellClick={handleMove}
                gameFinished={gameState.status === 'finished'}
              />
            </div>

          <div className="w-96">
            <h2 className="text-2xl font-bold mb-4">Macro Board</h2>
            <MacroBoard
              macroBoard={gameState.macroBoard}
              subWinners={gameState.subWinners}
              onCellClick={handleMacroMove}
              disabled={!gameState.awaitingMacroMove || gameState.status === 'finished'}
            />
          </div>
        </div>

        <button
          onClick={resetGame}
          className="mt-8 px-6 py-2 bg-danger hover:bg-red-600 rounded-lg font-semibold transition"
        >
          Back to Menu
        </button>
      </div>

      {showWinner && (
        <WinnerModal
          winner={winner}
          onClose={resetGame}
        />
      )}
    </div>
  );
}
