# Project Structure & File Guide

Complete overview of the Ultimate Tic-Tac-Toe project structure and what each file does.

## Directory Tree

```
Ultimate-tic-tac-toe/
├── 📄 README.md                    # Main project documentation
├── 📄 QUICKSTART.md                # Get started in 5 minutes
├── 📄 SETUP.md                     # Supabase database setup
├── 📄 RULES.md                     # Game rules & strategy guide
├── 📄 DEPLOYMENT.md                # Deploy to production
├── 📄 LICENSE                      # MIT License
├── 📄 package.json                 # Dependencies & scripts
├── 📄 vite.config.js               # Vite configuration
├── 📄 tailwind.config.js           # Tailwind CSS configuration
├── 📄 postcss.config.js            # PostCSS configuration
├── 📄 .env.example                 # Environment variables template
├── 📄 .gitignore                   # Git ignore rules
├── 📄 index.html                   # HTML entry point
│
├── 📁 src/                         # Source code directory
│   ├── 📄 main.jsx                 # React app entry point
│   ├── 📄 App.jsx                  # Main game component
│   ├── 📄 index.css                # Global styles
│   ├── 📄 gameLogic.js             # ⭐ CORE GAME LOGIC
│   ├── 📄 gameLogicExamples.js     # Usage examples & tests
│   ├── 📄 supabaseClient.js        # ⭐ DATABASE CONNECTION
│   │
│   └── 📁 components/              # React components
│       ├── 📄 GameBoard.jsx        # 3x3 sub-board grid display
│       ├── 📄 SubBoard.jsx         # Individual 3x3 board
│       ├── 📄 Cell.jsx             # Single cell button
│       ├── 📄 MacroBoard.jsx       # Macro board sidebar
│       ├── 📄 GameInfo.jsx         # Status & turn display
│       ├── 📄 ModeSelector.jsx     # Menu & mode selection
│       └── 📄 WinnerModal.jsx      # Victory announcement
│
└── 📁 dist/                        # Build output (generated)
    ├── index.html
    ├── assets/
    └── ...

Total: ~50 files (including node_modules)
```

---

## File Descriptions

### 🔴 Critical Game Logic Files

#### [`src/gameLogic.js`](../src/gameLogic.js) ⭐⭐⭐
**The heart of the game!** Contains all game rules and validation.

**Key Functions:**
- `createInitialGameState()` - Initialize a new game
- `validateMove()` - Check if a move is legal
- `executeGameTurn()` - Execute a complete turn
- `checkWinner()` - Detect 3-in-a-row
- `getNextActiveSubBoard()` - Determine target board
- `updateSubWinners()` - Track sub-board victories
- `checkMacroWinner()` - Detect game victory

**Key Concepts:**
- 81-cell flat board → 3x3 sub-boards
- Move index modulo 9 determines next sub-board
- Wildcard rule for full sub-boards
- Non-lock rule for won sub-boards
- Macro board reward moves

**Lines:** ~450 | **Difficulty:** ⭐⭐⭐⭐⭐

---

#### [`src/supabaseClient.js`](../src/supabaseClient.js) ⭐⭐⭐
**Database connection & real-time sync.**

**Key Functions:**
- `createGame()` - Create new game in database
- `getGame()` - Fetch game by ID
- `updateGame()` - Update game state
- `subscribeToGameUpdates()` - Real-time Realtime subscription
- `deleteGame()` - Clean up

**Uses:** Supabase JS client for PostgreSQL + Realtime

**Lines:** ~100 | **Difficulty:** ⭐⭐⭐

---

### 🟢 UI Component Files

#### [`src/components/GameBoard.jsx`](../src/components/GameBoard.jsx)
**Renders the main 3x3 grid of sub-boards.**

**Props:**
- `boardState` - All 81 cell values
- `subWinners` - Array of sub-board winners
- `activeSubBoard` - Currently playable board
- `onCellClick` - Move handler
- `gameFinished` - Game over flag

**Renders:** 9 SubBoard components

**Lines:** ~25 | **Difficulty:** ⭐

---

#### [`src/components/SubBoard.jsx`](../src/components/SubBoard.jsx)
**Individual 3x3 board with visual feedback.**

**Features:**
- Highlights active sub-board with green ring
- Dims inactive boards at 50% opacity
- Shows "Won" or "Draw" status
- Disabled when game is finished

**Props:** boardState, subBoardIndex, isActive, onCellClick, etc.

**Renders:** 9 Cell components per sub-board

**Lines:** ~45 | **Difficulty:** ⭐⭐

---

#### [`src/components/Cell.jsx`](../src/components/Cell.jsx)
**Individual game cell button.**

**Features:**
- Clickable when empty
- Shows 'X' or 'O' when filled
- Disabled when occupied or game finished
- Hover effects for UX

**Props:** cellIndex, value, onClick, disabled

**Lines:** ~25 | **Difficulty:** ⭐

---

#### [`src/components/MacroBoard.jsx`](../src/components/MacroBoard.jsx)
**Sidebar showing macro board (3x3 for sub-board wins).**

**Features:**
- Displays macro board state
- Allows placing marks when sub-board won
- Shows game winner when macro board won
- Reference back to sub-board statuses

**Props:** macroBoard, subWinners, onCellClick, disabled

**Lines:** ~70 | **Difficulty:** ⭐⭐

---

#### [`src/components/GameInfo.jsx`](../src/components/GameInfo.jsx)
**Status panel showing game state.**

**Displays:**
- Current mode (Local PvP or Online)
- Current player turn
- Game status (Playing/Finished)
- Macro move alert
- Share link for online games

**Lines:** ~50 | **Difficulty:** ⭐

---

#### [`src/components/ModeSelector.jsx`](../src/components/ModeSelector.jsx)
**Initial menu screen.**

**Features:**
- Choose Local PvP
- Host online game
- Join online game
- Rules explanation

**Props:** onLocalPvP, onOnlineHost, onOnlineJoin

**Lines:** ~120 | **Difficulty:** ⭐⭐

---

#### [`src/components/WinnerModal.jsx`](../src/components/WinnerModal.jsx)
**Victory/draw announcement popup.**

**Shows:**
- Winner announcement
- Celebration emoji
- Play again button

**Lines:** ~40 | **Difficulty:** ⭐

---

### 🔵 Main Application Files

#### [`src/App.jsx`](../src/App.jsx) ⭐⭐
**Main game controller component.**

**Responsibilities:**
1. Mode selection (local vs online)
2. Game initialization
3. Move handling (micro & macro)
4. State management
5. Supabase real-time subscriptions
6. Game updates & database sync

**State Management:**
- `gameMode`, `gameState`, `gameId`, `currentPlayerId`
- `awaitingMacroMove`, `selectedMacroCell`
- `showWinner`, `winner`

**Key Methods:**
- `startLocalGame()` - Initialize local PvP
- `startOnlineGame()` - Create game on Supabase
- `joinOnlineGame()` - Connect to existing game
- `handleMove()` - Process micro moves
- `handleMacroMove()` - Process macro moves

**Lines:** ~250 | **Difficulty:** ⭐⭐⭐⭐

---

#### [`src/main.jsx`](../src/main.jsx)
**React entry point.**

- Imports App component
- Renders to DOM
- Imports global CSS

**Lines:** ~10 | **Difficulty:** ⭐

---

#### [`src/index.css`](../src/index.css)
**Global styles & Tailwind imports.**

- Tailwind directives
- Custom animations
- Global resets
- Utility styling

**Lines:** ~40

---

### 📋 Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies, scripts, project metadata |
| `vite.config.js` | Vite build configuration |
| `tailwind.config.js` | Tailwind CSS customization |
| `postcss.config.js` | PostCSS plugins (Tailwind, Autoprefixer) |
| `index.html` | HTML entry point |
| `.env.example` | Supabase credentials template |
| `.gitignore` | Git ignore rules |

---

### 📚 Documentation Files

| File | Content |
|------|---------|
| `README.md` | Main documentation & overview |
| `QUICKSTART.md` | 5-minute setup guide |
| `SETUP.md` | Supabase database setup |
| `RULES.md` | Game rules & strategy |
| `DEPLOYMENT.md` | Production deployment guide |
| `LICENSE` | MIT License |

---

## Dependency Graph

```
App.jsx
├── GameBoard.jsx
│   └── SubBoard.jsx
│       └── Cell.jsx
├── MacroBoard.jsx
├── GameInfo.jsx
├── ModeSelector.jsx
└── WinnerModal.jsx

gameLogic.js (imported by App.jsx & all game logic)
supabaseClient.js (imported by App.jsx for online play)
```

---

## Data Flow

### Local PvP Game Flow

```
User selects "Local PvP"
    ↓
createInitialGameState()
    ↓
GameBoard renders with activeSubBoard
    ↓
User clicks cell → handleMove()
    ↓
executeGameTurn()
    ├── validateMove()
    ├── updateSubWinners()
    └── getNextActiveSubBoard()
    ↓
Check if sub-board won
    ├── YES → awaitingMacroMove = true
    │   └── User clicks MacroBoard cell
    │       ↓
    │       checkMacroWinner()
    │       └── If 3-in-a-row → Game Over!
    │
    └── NO → Next player's turn
```

### Online Multiplayer Flow

```
User selects "Host a Game" or "Join with Link"
    ↓
createGame() or joinOnlineGame()
    ↓
subscribeToGameUpdates(gameId)
    ↓
Player X makes move
    ├── executeGameTurn()
    └── updateGame(gameId, newState)
    ↓
Real-time Realtime updates Player O's UI
    ↓
Player O sees update instantly
```

---

## File Size Reference

| File | Size | Type |
|------|------|------|
| gameLogic.js | ~10 KB | Core |
| App.jsx | ~8 KB | React |
| supabaseClient.js | ~3 KB | DB |
| Components folder | ~15 KB | React |
| Total Source | ~50 KB | - |
| After Build (gzip) | ~15 KB | - |

---

## Code Style & Conventions

- **Naming:** camelCase for variables/functions, PascalCase for components
- **Imports:** ES6 modules (`import`/`export`)
- **Comments:** JSDoc for functions, inline for complex logic
- **Error Handling:** Try-catch in async operations
- **State Management:** React hooks (`useState`, `useEffect`)
- **Styling:** Tailwind CSS utility classes

---

## Where to Find Things

| Need | Look in |
|------|----------|
| Game rules | `gameLogic.js` comments or `RULES.md` |
| How to validate moves | `gameLogic.js` → `validateMove()` |
| How to detect winner | `gameLogic.js` → `checkWinner()` |
| How moves are rendered | `GameBoard.jsx` → `SubBoard.jsx` → `Cell.jsx` |
| How to make online game | `supabaseClient.js` → `createGame()` |
| How real-time works | `App.jsx` → `subscribeToGameUpdates()` |
| Styling/CSS | `index.css` or component `.jsx` files |
| Game logic examples | `gameLogicExamples.js` |
| Setup instructions | `QUICKSTART.md` or `SETUP.md` |

---

## Next Steps

1. **Understand core logic:** Read `gameLogic.js`
2. **See it in action:** Run `npm run dev`
3. **Learn deployment:** Read `DEPLOYMENT.md`
4. **Explore components:** Check `src/components/` structure
5. **Build features:** Extend from existing patterns

Happy exploring! 🎮
