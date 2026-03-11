# Ultimate Tic-Tac-Toe with Macro Board

A real-time multiplayer web-based game combining the strategic depth of Ultimate Tic-Tac-Toe with an innovative **Macro Board** system.

## Features

🎮 **Local PvP Mode**: Play against a friend on the same computer  
🌐 **Online Multiplayer**: Real-time synchronization via Supabase  
📊 **Three-Tier Hierarchy**: Micro cells → Sub-boards → Macro Board  
🎯 **Strategic Gameplay**: Win sub-boards to place marks on the Macro Board  
🔄 **Wildcard Rule**: Free play when target sub-board is full  
⚡ **Real-time Sync**: Live multiplayer with Supabase Realtime  

## How to Play

### Game Structure

- **81 Micro Cells**: Arranged in 3x3 grids within 9 Sub-Boards
- **9 Sub-Boards**: Form a 3x3 grid on the game board
- **1 Macro Board**: Win to claim victory

### Core Rules

1. **Move Placement**: Your move index (0-80) modulo 9 determines the next player's active sub-board
   - Example: If you play at index 15, the next player must play in sub-board 15 % 9 = 6

2. **Sub-Board Wins**: Get 3-in-a-row in a sub-board to win it

3. **Reward System**: When you win a sub-board, you get a "Reward Move":
   - A mark is applied to your cell on the Macro Board
   - The UI highlights the Macro Board prompting you to choose a cell

4. **Non-Lock Rule**: You can still play in a Sub-Board that's already won/drawn
   - The move is recorded on the Micro level
   - But it doesn't change the Sub-Board winner

5. **Wildcard Rule**: If the target sub-board is 100% full:
   - You get free play (`activeSubBoard = null`)
   - You can place your move anywhere on non-full sub-boards

6. **Victory**: First player to get 3-in-a-row on the Macro Board wins the game

## Installation

### Prerequisites

- Node.js 16+ and npm
- Supabase account (for online play)

### Setup

1. **Clone/Extract the repository**
   ```bash
   cd Ultimate-tic-tac-toe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Supabase (for online play)**
   - Create a Supabase project at https://supabase.com
   - Create a table `games` with the following schema:
     ```sql
     CREATE TABLE public.games (
       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
       board_state JSONB NOT NULL,
       sub_winners JSONB NOT NULL,
       macro_board JSONB NOT NULL,
       active_sub_board INT,
       current_turn CHAR(1) NOT NULL,
       winner CHAR(1),
       status TEXT NOT NULL,
       created_at TIMESTAMPTZ DEFAULT now()
     );
     ```

   - Copy your Supabase URL and Anon Key
   - Create a `.env.local` file:
     ```env
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   The game will open at `http://localhost:5173`

## Project Structure

```
Ultimate-tic-tac-toe/
├── src/
│   ├── components/
│   │   ├── GameBoard.jsx       # Main 3x3 sub-board grid
│   │   ├── SubBoard.jsx        # Individual 3x3 sub-board
│   │   ├── Cell.jsx            # Single micro cell
│   │   ├── MacroBoard.jsx      # Macro board sidebar
│   │   ├── GameInfo.jsx        # Game status panel
│   │   ├── ModeSelector.jsx    # Mode selection screen
│   │   └── WinnerModal.jsx     # Win announcement modal
│   ├── App.jsx                 # Main app component
│   ├── gameLogic.js            # Core game logic & validation
│   ├── supabaseClient.js       # Supabase integration
│   ├── main.jsx                # React entry point
│   └── index.css               # Global styles
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── .env.example
```

## Game Logic Documentation

### Core Functions

#### Move Validation
```javascript
const { isValid, reason } = validateMove(
  moveIndex,      // 0-80
  boardState,     // Current board state
  activeSubBoard, // Current active sub-board (or null for free play)
  currentPlayer,  // 'X' or 'O'
  subWinners,     // Sub-board winner array
  isFree          // Is free play active?
);
```

#### Board Updates
```javascript
const { updated, newWinners } = updateSubWinners(
  boardState,
  subWinners
);
```

#### Next Sub-Board Determination
```javascript
const { nextSubBoard, isFree } = getNextActiveSubBoard(
  moveIndex,    // Last move index
  boardState,
  subWinners
);
```

#### Complete Turn Execution (Local PvP)
```javascript
const result = executeGameTurn(currentGameState, moveIndex, macroMoveIndex);
if (result.success) {
  // Update state with result.state
}
```

### Key Utilities

- `getSubBoardIndex(globalIndex)` - Convert cell index to sub-board (0-8)
- `getCellIndexInSubBoard(globalIndex)` - Get position within sub-board
- `getSubBoardCells(subBoardIndex)` - Get all cell indices for a sub-board
- `checkWinner(board)` - Check 3-in-a-row on any 9-cell board
- `isSubBoardFull(boardState, subBoardIndex)` - Wildcard rule check
- `didPlayerWinSubBoard(prevWinners, currentWinners, player)` - Detect sub-board victory

## Online Play

### How to Share

1. **Host a Game**: Click "Host a Game" on the mode selection screen
2. **Copy Link**: Share the generated link with your opponent
3. **Join**: Friend clicks the link and joins automatically

### Real-time Sync

The game uses Supabase Realtime with PostgreSQL change subscriptions:

```typescript
subscribeToGameUpdates(gameId, (updatedGame) => {
  // Auto-sync when opponent moves
  setGameState(updatedGame);
});
```

## UI/UX Features

- **Active Sub-Board Highlighting**: Green ring around playable sub-board
- **Opacity Dimming**: Non-active sub-boards at 50% opacity
- **Macro Move Prompt**: Animated alert when sub-board is won
- **Responsive Design**: Works on desktop and tablet
- **Tailwind CSS**: Modern, clean styling

## Database Schema

```sql
CREATE TABLE public.games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_state JSONB NOT NULL,        -- [81 cells: null/'X'/'O']
  sub_winners JSONB NOT NULL,        -- [9 values: null/'X'/'O'/'Draw']
  macro_board JSONB NOT NULL,        -- [9 cells: null/'X'/'O']
  active_sub_board INT,              -- [0-8 or null for wildcard]
  current_turn CHAR(1) NOT NULL,     -- ['X' or 'O']
  winner CHAR(1),                    -- [null/'X'/'O'/'D' for draw]
  status TEXT NOT NULL,              -- ['waiting'/'playing'/'finished']
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## Development

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Lint Code
```bash
npm run lint
```

## Known Limitations & Future Enhancements

- ✅ Local PvP and Online Play modes
- ✅ Complete game logic with all rules
- ⚠️ No authentication system (anyone can join any game)
- 🔄 Consider adding: Game history, player rankings, AI opponent

## License

See LICENSE file

## Support & Feedback

For issues or feature requests, please open an issue on the repository.

---

**Created with ❤️ for strategic game enthusiasts**
