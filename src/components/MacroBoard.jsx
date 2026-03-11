import React from 'react';

export default function MacroBoard({
  macroBoard,
  subWinners,
  onCellClick,
  disabled
}) {
  const getSubBoardStatus = (index) => {
    return subWinners[index];
  };

  const checkMacroWinner = (board) => {
    const combos = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    for (const [a, b, c] of combos) {
      if (board[a] && board[a] === board[b] && board[b] === board[c]) {
        return board[a];
      }
    }

    if (board.every(cell => cell !== null)) {
      return 'Draw';
    }

    return null;
  };

  const macroWinner = checkMacroWinner(macroBoard);

  return (
    <div className="bg-dark/50 p-4 rounded-lg border-2 border-primary">
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 9 }, (_, i) => {
          const cellValue = macroBoard[i];
          const subStatus = getSubBoardStatus(i);

          return (
            <button
              key={i}
              onClick={() => onCellClick(i)}
              disabled={disabled || cellValue !== null}
              className={`
                aspect-square rounded-lg font-bold text-lg transition-all
                flex items-center justify-center relative
                ${cellValue === null && !disabled ? 'bg-light/20 hover:bg-light/30 cursor-pointer' : 'cursor-not-allowed'}
                ${cellValue === 'X' ? 'bg-primary text-white' : ''}
                ${cellValue === 'O' ? 'bg-secondary text-white' : ''}
                ${disabled && cellValue === null ? 'opacity-50' : ''}
                ${subStatus === null ? 'ring-1 ring-light/30' : 'ring-2 ring-light/50'}
              `}
              title={`Board ${i}: ${subStatus || 'Ongoing'}`}
            >
              {cellValue}
            </button>
          );
        })}
      </div>

      {macroWinner && (
        <div className="mt-4 p-3 bg-light/10 rounded-lg text-center">
          {macroWinner === 'Draw' ? (
            <p className="font-bold text-light/70">Macro Board: Draw</p>
          ) : (
            <p className="font-bold text-secondary">
              Player {macroWinner} wins the game!
            </p>
          )}
        </div>
      )}

      <div className="mt-4 text-xs text-light/50 space-y-1">
        <p>Each board represents a sub-board win.</p>
        <p>Get 3-in-a-row to win the game.</p>
      </div>
    </div>
  );
}
