import React from 'react';
import { getSubBoardCells, checkWinner } from '../gameLogic';
import Cell from './Cell';

export default function SubBoard({
  subBoardIndex,
  boardState,
  subWinners,
  isActive,
  onCellClick,
  gameFinished
}) {
  const cells = getSubBoardCells(subBoardIndex);
  const winner = subWinners[subBoardIndex];
  const isWon = winner !== null;

  return (
    <div
      className={`
        p-2 rounded-lg transition-all
        ${isActive ? 'opacity-100 border-2 border-secondary' : 'opacity-50 border-2 border-light/20'}
        ${isWon ? 'bg-light/10' : 'bg-dark/50'}
        ${gameFinished ? 'cursor-not-allowed' : ''}
      `}
    >
      <div className="grid grid-cols-3 gap-1 bg-dark p-1 rounded">
        {cells.map((cellIndex) => (
          <Cell
            key={cellIndex}
            cellIndex={cellIndex}
            value={boardState[cellIndex]}
            onClick={() => !gameFinished && onCellClick(cellIndex)}
            disabled={gameFinished}
          />
        ))}
      </div>
      
      {isWon && winner !== 'Draw' && (
        <div className="mt-2 text-center font-bold text-xl text-secondary">
          {winner} Won
        </div>
      )}
      
      {isWon && winner === 'Draw' && (
        <div className="mt-2 text-center font-bold text-lg text-light/70">
          Draw
        </div>
      )}
    </div>
  );
}
