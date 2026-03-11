import React, { useState } from 'react';

export default function ModeSelector({ onLocalPvP, onOnlineHost, onOnlineJoin }) {
  const [joinMode, setJoinMode] = useState(false);
  const [gameId, setGameId] = useState('');

  const handleJoin = () => {
    if (gameId.trim()) {
      onOnlineJoin(gameId, 'O');
      setGameId('');
      setJoinMode(false);
    } else {
      alert('Please enter a game ID');
    }
  };

  const handleUrlJoin = () => {
    const params = new URLSearchParams(window.location.search);
    const urlGameId = params.get('gameId');
    const playerId = params.get('playerId');

    if (urlGameId && playerId) {
      onOnlineJoin(urlGameId, playerId);
    }
  };

  // Check if we're joining from URL
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlGameId = params.get('gameId');
    const playerId = params.get('playerId');

    if (urlGameId && playerId) {
      onOnlineJoin(urlGameId, playerId);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-dark-900 to-dark flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-primary mb-2">
            Ultimate Tic-Tac-Toe
          </h1>
          <p className="text-light/70 text-lg">
            Three-tier gameplay with a Macro Board
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Local PvP Card */}
          <div
            onClick={onLocalPvP}
            className="group cursor-pointer bg-dark/70 hover:bg-dark/90 border-2 border-secondary hover:border-secondary/80 rounded-lg p-8 transition-all transform hover:scale-105"
          >
            <div className="text-center">
              <div className="text-5xl mb-4">🎮</div>
              <h2 className="text-2xl font-bold text-secondary mb-2">Local PvP</h2>
              <p className="text-light/70">
                Play against a friend on the same computer. Take turns and compete locally.
              </p>
              <button className="mt-6 px-6 py-2 bg-secondary text-dark font-bold rounded-lg hover:bg-green-400 transition w-full">
                Start Local Game
              </button>
            </div>
          </div>

          {/* Online Play Card */}
          <div className="bg-dark/70 border-2 border-primary rounded-lg p-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🌐</div>
              <h2 className="text-2xl font-bold text-primary mb-2">Online Play</h2>
              <p className="text-light/70 mb-6">
                Play with someone online. Host a game or join an existing one.
              </p>

              <div className="space-y-3">
                <button
                  onClick={onOnlineHost}
                  className="w-full px-4 py-2 bg-primary text-dark font-bold rounded-lg hover:bg-blue-400 transition"
                >
                  Host a Game
                </button>

                <button
                  onClick={() => setJoinMode(!joinMode)}
                  className="w-full px-4 py-2 bg-primary/70 text-dark font-semibold rounded-lg hover:bg-blue-300 transition"
                >
                  {joinMode ? 'Cancel' : 'Join a Game'}
                </button>
              </div>

              {joinMode && (
                <div className="mt-4 pt-4 border-t border-primary/30 space-y-3">
                  <input
                    type="text"
                    placeholder="Enter Game ID"
                    value={gameId}
                    onChange={(e) => setGameId(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
                    className="w-full px-3 py-2 bg-dark border border-light/30 rounded text-light placeholder-light/50"
                  />
                  <button
                    onClick={handleJoin}
                    className="w-full px-4 py-2 bg-secondary text-dark font-bold rounded-lg hover:bg-green-400 transition"
                  >
                    Join
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* How to Play */}
        <div className="mt-12 bg-dark/50 border border-light/20 rounded-lg p-6">
          <h3 className="text-xl font-bold text-primary mb-4">How to Play</h3>
          <ul className="space-y-2 text-light/70 text-sm">
            <li>✓ Play on a 3x3 grid of 3x3 sub-boards (81 cells total)</li>
            <li>✓ Win a sub-board to place a mark on the Macro Board</li>
            <li>✓ First to get 3-in-a-row on the Macro Board wins!</li>
            <li>✓ Winning a sub-board gives you a "Reward Move" on the Macro Board</li>
            <li>✓ Can't play in a full sub-board? Get free play (Wildcard Rule)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
