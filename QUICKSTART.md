# Quick Start Guide

Get the game running in 5 minutes!

## For Local PvP (No Setup Required)

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser to http://localhost:5173
# 4. Click "Local PvP"
# 5. Play! 🎮
```

That's it! Local PvP works immediately with zero configuration.

---

## For Online Play (Requires Supabase Setup)

### Quick Setup (2 minutes)

1. **Create Supabase Account**
   - Go to https://supabase.com → Sign up (free tier available)
   - Create new project

2. **Run SQL Script**
   - In Supabase dashboard → SQL Editor
   - Create new query and paste [this SQL script](./SETUP.md#step-2-create-the-games-table)
   - Click Run

3. **Enable Realtime**
   - Go to Replication settings
   - Toggle the `games` table
   - Select Inserts, Updates, Deletes

4. **Get Credentials**
   - Settings → API
   - Copy Project URL and Anon Key

5. **Configure App**
   ```bash
   # Create .env.local
   echo 'VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key' > .env.local
   ```

6. **Restart App**
   ```bash
   npm run dev
   ```

7. **Test Online**
   - Click "Host a Game"
   - Copy the link
   - Open in another browser/device
   - Link automatically joins! ✨

---

## File Structure Reference

```
src/
├── gameLogic.js          ← All game rules
├── supabaseClient.js     ← Database connection
├── App.jsx               ← Main game logic
├── main.jsx              ← React entry point
├── index.css             ← Global styles
└── components/
    ├── GameBoard.jsx     ← 3x3 sub-board grid
    ├── SubBoard.jsx      ← Individual 3x3 board
    ├── Cell.jsx          ← Single cell
    ├── MacroBoard.jsx    ← Macro board sidebar
    ├── GameInfo.jsx      ← Status panel
    ├── ModeSelector.jsx  ← Menu screen
    └── WinnerModal.jsx   ← Win popup
```

---

## Common Issues

### "Cannot find module '@supabase/supabase-js'"
```bash
npm install
```

### "Supabase connection failed"
- Check `.env.local` file exists
- Verify URL starts with `https://` and ends with `.supabase.co`
- Restart dev server: `npm run dev`

### "Real-time not syncing"
- Check Supabase Replication settings
- Ensure `games` table has Inserts/Updates/Deletes enabled
- Wait 5 seconds between turns for sync

---

## Next Steps

- 📖 Read [RULES.md](./RULES.md) to learn strategy
- 📚 Check [README.md](./README.md) for full documentation
- 🛠️ See [SETUP.md](./SETUP.md) for detailed Supabase setup
- 🎮 Share and challenge your friends!

---

**Questions?** Check the documentation or see the game source code in `src/`. The code is well-commented and structured for learning.

Happy playing! 🎉
