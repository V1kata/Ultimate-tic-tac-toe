import React from 'react';
import { getSubBoardCells, checkWinner } from '../gameLogic';
import SubBoard from './SubBoard';

export default function GameBoard({
  boardState,
  subWinners,
  activeSubBoard,
  onCellClick,
  gameFinished
}) {
  return (
    <div className="bg-dark-900 p-4 rounded-lg border-4 border-primary shadow-2xl">
      <div className="grid grid-cols-3 gap-2 bg-dark">
        {Array.from({ length: 9 }, (_, i) => (
          <SubBoard
            key={i}
            subBoardIndex={i}
            boardState={boardState}
            subWinners={subWinners}
            isActive={activeSubBoard === i || activeSubBoard === null}
            onCellClick={onCellClick}
            gameFinished={gameFinished}
          />
        ))}
      </div>
    </div>
  );
}
