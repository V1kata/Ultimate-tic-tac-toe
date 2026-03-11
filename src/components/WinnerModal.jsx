import React from 'react';

export default function WinnerModal({ winner, onClose }) {
  const getWinnerMessage = () => {
    if (winner === 'D') {
      return {
        title: 'It\'s a Draw!',
        subtitle: 'The Macro Board is full!',
        color: 'text-light'
      };
    }
    return {
      title: `Player ${winner} Wins!`,
      subtitle: `${winner} got 3-in-a-row on the Macro Board!`,
      color: winner === 'X' ? 'text-primary' : 'text-secondary'
    };
  };

  const message = getWinnerMessage();

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-dark border-4 border-primary rounded-2xl p-8 text-center max-w-md w-full transform animate-pulse">
        <div className="text-6xl mb-4">
          {winner === 'D' ? '🤝' : '🎉'}
        </div>

        <h2 className={`text-4xl font-bold mb-2 ${message.color}`}>
          {message.title}
        </h2>

        <p className="text-light/70 mb-8 text-lg">
          {message.subtitle}
        </p>

        <button
          onClick={onClose}
          className="px-8 py-3 bg-primary hover:bg-blue-600 text-dark font-bold rounded-lg transition-all transform hover:scale-105"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
