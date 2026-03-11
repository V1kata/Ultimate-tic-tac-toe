import React from 'react';

export default function Cell({ cellIndex, value, onClick, disabled }) {
  return (
    <button
      onClick={() => onClick(cellIndex)}
      disabled={disabled || value !== null}
      className={`
        aspect-square rounded-md font-bold text-xl transition-all
        flex items-center justify-center
        ${value === null && !disabled ? 'bg-light/20 hover:bg-light/30 cursor-pointer' : 'cursor-not-allowed'}
        ${value === 'X' ? 'bg-primary text-white' : ''}
        ${value === 'O' ? 'bg-secondary text-white' : ''}
        ${disabled && value === null ? 'opacity-30' : ''}
      `}
    >
      {value}
    </button>
  );
}
