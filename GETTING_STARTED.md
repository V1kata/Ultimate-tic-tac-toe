# 🎮 Ultimate Tic-Tac-Toe with Macro Board - Getting Started

Welcome! You have a complete, production-ready multiplayer game. Here's how to get started.

## 📋 What You Have

✅ **Complete React + Vite Application**
- Modern JavaScript with ES6 modules
- Real-time multiplayer via Supabase
- Beautiful Tailwind CSS UI
- Fully responsive design

✅ **Robust Game Logic**
- 3-tier board system (81 cells → 9 sub-boards → Macro board)
- All game rules implemented
- Move validation
- Win detection
- Wildcard rule support
- Non-lock rule support

✅ **Two Game Modes**
- 🎮 **Local PvP**: Play on same computer
- 🌐 **Online**: Real-time multiplayer with link sharing

✅ **Comprehensive Documentation**
- [README.md](./README.md) - Main documentation
- [QUICKSTART.md](./QUICKSTART.md) - 5-minute setup
- [SETUP.md](./SETUP.md) - Supabase configuration
- [RULES.md](./RULES.md) - Game rules & strategy
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - File guide
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Production deployment
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common issues

---

## 🚀 Quick Start (< 5 minutes)

### Step 1: Install & Run

```bash
# Install dependencies
npm install

# Start the game
npm run dev

# Opens at http://localhost:5173
```

### Step 2: Choose Game Mode

- **Local PvP**: Click "Local PvP" and play immediately (no setup needed)
- **Online**: See "Step 3" below for Supabase setup

### Step 3 (Optional): Enable Online Play

For 🌐 real-time multiplayer:

1. **Create Supabase Account** (free): https://supabase.com
2. **Create a project** (enter project name)
3. **Copy credentials** from Settings → API
4. **Create `.env.local`**:
   ```env
   VITE_SUPABASE_URL=your_url_here
   VITE_SUPABASE_ANON_KEY=your_key_here
   ```
5. **Run database setup** (see [SETUP.md](./SETUP.md))
6. **Restart**: `npm run dev`
7. **Test**: Click "Host a Game" → Share the link!

---

## 📚 Documentation Map

| Document | Purpose | Time |
|----------|---------|------|
| [QUICKSTART.md](./QUICKSTART.md) | Get started in 5 minutes | 5 min |
| [README.md](./README.md) | Full feature overview | 10 min |
| [RULES.md](./RULES.md) | Game rules & strategy | 15 min |
| [SETUP.md](./SETUP.md) | Supabase configuration | 10 min |
| [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) | Code organization | 10 min |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Deploy to production | 15 min |
| [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) | Fix common issues | As needed |

---

## 🎯 Next Steps

### To Play Immediately

```bash
npm install && npm run dev
→ Click "Local PvP" → Play!
```

### To Enable Online Mode

1. Read [SETUP.md](./SETUP.md) (10 minutes)
2. Set up Supabase database
3. Add `.env.local` credentials
4. Restart server
5. Click "Host a Game"
6. Share link with friend
7. Friend clicks link and joins!

### To Deploy to the Web

1. Read [DEPLOYMENT.md](./DEPLOYMENT.md)
2. Choose platform (Vercel, Netlify, etc.)
3. Connect your GitHub repo
4. Deploy in ~5 minutes
5. Share with the world!

### To Understand the Code

1. Check [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
2. Read core logic in `src/gameLogic.js`
3. Explore React components in `src/components/`
4. Study examples in `src/gameLogicExamples.js`

### To Learn Game Strategy

1. Read [RULES.md](./RULES.md)
2. Play a few local games
3. Experiment with Online mode
4. Challenge friends!

---

## 🏗️ Project Structure at a Glance

```
src/
├── App.jsx              ← Main game logic (start here!)
├── gameLogic.js         ← All game rules (star of the show)
├── supabaseClient.js    ← Database connection
├── index.css            ← Styles
├── main.jsx             ← React entry point
└── components/          ← UI components
    ├── GameBoard.jsx    ← 3x3 board display
    ├── SubBoard.jsx     ← Individual board
    ├── Cell.jsx         ← Single cell
    ├── MacroBoard.jsx   ← Win tracker sidebar
    ├── GameInfo.jsx     ← Status display
    ├── ModeSelector.jsx ← Menu screen
    └── WinnerModal.jsx  ← Victory popup
```

---

## 🎮 How to Play

1. **Your Move**: Click an empty cell in the highlighted sub-board
2. **Win a Sub-Board**: Get 3-in-a-row to mark the Macro Board
3. **Macro Move**: When you win a sub-board, place your mark on the 3x3 Macro Board
4. **Win the Game**: First to get 3-in-a-row on the Macro Board wins!

### Special Rules

- **Wildcard**: Target sub-board full? Play anywhere!
- **Non-Lock**: Can play in won sub-boards (moves don't change winner)
- **Reward Moves**: Winning a sub-board gives you a Macro Board move

---

## 📊 Game Components at a Glance

```
┌─────────────────────────────────────┐
│   Game Status Panel (GameInfo)      │
│ Current Turn: X | Status: Playing   │
└─────────────────────────────────────┘

┌──────────────────────┐ ┌──────────────┐
│   Game Board         │ │   Macro      │
│  (9 sub-boards)      │ │   Board      │
│  3x3 layout          │ │  Tracker     │
│  ▢▢▢ ▢▢▢ ▢▢▢        │ │  3x3 grid    │
│  ▢▢▢ ▢▢▢ ▢▢▢        │ │               │
│  ▢▢▢ ▢▢▢ ▢▢▢        │ │  Shows which  │
│                      │ │  sub-boards  │
│                      │ │  are won     │
└──────────────────────┘ └──────────────┘
```

---

## 🔑 Key Concepts

### Three-Tier Board

```
Macro Board (Level 3)
    3x3 grid tracking sub-board wins
    ↓
Sub-Boards (Level 2) - 9 of them
    Each is a 3x3 grid
    ↓
Micro Cells (Level 1) - 81 total
    Individual game cells (X, O, or empty)
```

### Move Resolution

```
Player makes micro move at index N
    ↓
Check if won sub-board N÷9
    ├─→ YES: Reward Move on Macro Board
    │       └─→ Check if won game
    │
    └─→ NO: Continue to next player
    
Next player must play in sub-board N%9
(unless that sub-board is full → Wildcard!)
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18.2 |
| **Build** | Vite 5.0 |
| **Styling** | Tailwind CSS 3.3 |
| **Database** | Supabase (PostgreSQL) |
| **Real-time** | Supabase Realtime |
| **Runtime** | Node.js 16+ |

---

## ✨ Features Included

### Core Game
- ✅ 3-tier board system (81 cells → 9 sub-boards → Macro board)
- ✅ Move validation with all rules
- ✅ Win detection (3-in-a-row)
- ✅ Wildcard rule (free play when target full)
- ✅ Non-lock rule (play in won sub-boards)
- ✅ Reward move system (Macro Board placement)

### Game Modes
- ✅ Local PvP (same computer)
- ✅ Online multiplayer (real-time sync)
- ✅ Game state persistence
- ✅ Join with URL link sharing

### UI/UX
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Tailwind CSS styling
- ✅ Active board highlighting
- ✅ Macro move notifications
- ✅ Winner announcement modal
- ✅ Game status panel

### Production Ready
- ✅ Error handling
- ✅ Input validation
- ✅ Real-time subscriptions
- ✅ Database integration
- ✅ Deployment guides

---

## 🚨 Common First-Time Issues & Fixes

| Issue | Solution |
|-------|----------|
| "npm command not found" | Install Node.js from nodejs.org |
| Blank screen after `npm run dev` | Wait 30 seconds, hard refresh (Ctrl+Shift+R) |
| "Port 5173 already in use" | Run on different port in vite.config.js |
| Supabase errors | Check .env.local has correct credentials |
| Real-time not syncing | Enable Replication in Supabase Settings |
| Connection refused | Restart dev server, check internet |

**Full troubleshooting:** See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

## 💡 Pro Tips

1. **Start with Local PvP** - No setup needed, understand the game first
2. **Read RULES.md before Online** - Understand strategy then test online
3. **Use your phone for 2nd player** - Share localhost URL: `192.168.x.x:5173`
4. **Watch the green ring** - Shows which sub-board you must play in
5. **Plan Macro moves ahead** - Think about sub-board control
6. **Experiment with Wildcard** - Full sub-boards unlock strategic options

---

## 🎓 Learn the Code

**Start with these files in order:**

1. **[gameLogic.js](./src/gameLogic.js)** - Read comments, understand rules
2. **[App.jsx](./src/App.jsx)** - Follow game flow, state management
3. **[components](./src/components/)** - See how UI renders the logic
4. **[supabaseClient.js](./src/supabaseClient.js)** - Database integration

**Then explore:**
- Game examples: `src/gameLogicExamples.js`
- Configuration: `vite.config.js`, `tailwind.config.js`
- Styles: `src/index.css`

---

## 🚀 Deploy Your Game

Get it live in minutes:

1. **Push to GitHub** (if not already)
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Choose platform** (easiest: Vercel)
   - Go to https://vercel.com/dashboard
   - Import your GitHub repo
   - Click Deploy
   - Done! 🎉

**Full guide:** See [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 📞 Need Help?

1. **Check docs** - Start with [README.md](./README.md) or [QUICKSTART.md](./QUICKSTART.md)
2. **Search guides** - [SETUP.md](./SETUP.md), [RULES.md](./RULES.md), [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
3. **Fix issues** - [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
4. **Read code comments** - Especially `gameLogic.js`
5. **Check examples** - `gameLogicExamples.js` has usage patterns

---

## 🎉 You're Ready!

Everything you need is set up and documented. 

### Right Now:

```bash
npm install && npm run dev
```

Click **"Local PvP"** and start playing! 

### Next:

Read [RULES.md](./RULES.md) to understand strategy, then try Online mode.

---

## 📝 Quick Reference

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

| File | Purpose |
|------|---------|
| `gameLogic.js` | Game rules & logic |
| `App.jsx` | Main game component |
| `supabaseClient.js` | Database connection |
| `components/` | UI components |

---

## 🎮 Have Fun!

The game is fully playable and ready to go. Challenge your friends, learn the strategy, and enjoy this unique three-tier twist on classic Tic-Tac-Toe!

**Happy playing!** 🎉

---

**Questions?** Check the documentation or explore the well-commented code.

*Last updated: March 2026*
