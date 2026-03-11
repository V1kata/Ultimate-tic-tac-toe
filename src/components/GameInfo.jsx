import React from 'react';

export default function GameInfo({
  gameMode,
  currentPlayer,
  status,
  winner,
  awaitingMacroMove,
  gameLink,
  onCopyLink
}) {
  return (
    <div className="bg-dark/70 p-6 rounded-lg border-2 border-primary/50 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-light/70 text-sm">Mode</p>
          <p className="text-lg font-semibold text-secondary">
            {gameMode === 'local' ? '🎮 Local PvP' : '🌐 Online Play'}
          </p>
        </div>

        <div>
          <p className="text-light/70 text-sm">Status</p>
          <p className="text-lg font-semibold">
            {status === 'playing' ? '▶️ Playing' : '✓ Finished'}
          </p>
        </div>

        {status === 'playing' && (
          <div>
            <p className="text-light/70 text-sm">Current Turn</p>
            <p className={`text-lg font-bold ${currentPlayer === 'X' ? 'text-primary' : 'text-secondary'}`}>
              Player {currentPlayer}
            </p>
          </div>
        )}

        {awaitingMacroMove && (
          <div>
            <p className="text-light/70 text-sm">Action Required</p>
            <p className="text-lg font-bold text-danger animate-pulse">
              Place on Macro Board!
            </p>
          </div>
        )}
      </div>

      {gameLink && (
        <div className="mt-4 pt-4 border-t border-primary/30">
          <p className="text-light/70 text-sm mb-2">Share this link with opponent:</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={gameLink}
              readOnly
              className="flex-1 px-3 py-2 bg-dark border border-light/30 rounded text-light text-sm"
            />
            <button
              onClick={onCopyLink}
              className="px-4 py-2 bg-primary hover:bg-blue-600 rounded font-semibold transition"
            >
              Copy Link
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
