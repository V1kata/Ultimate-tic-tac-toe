# Troubleshooting Guide

Common issues and solutions for the Ultimate Tic-Tac-Toe game.

## Installation & Setup

### Issue: "npm command not found"

**Solution:**
- Install Node.js from https://nodejs.org/
- Choose LTS version
- Verify: `node --version` and `npm --version`

---

### Issue: "Cannot find module" errors

**Cause:** Dependencies not installed

**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

---

### Issue: "npm ERR! code ERESOLVE"

**Cause:** Dependency conflict

**Solution:**
```bash
# Force legacy resolution
npm install --legacy-peer-deps
```

---

## Development Server

### Issue: "Port 5173 is already in use"

**Cause:** Another application using the port

**Solutions:**

Option 1: Kill the process
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5173
kill -9 <PID>
```

Option 2: Use different port
```bash
# In vite.config.js
server: {
  port: 5174  // or any available port
}
```

---

### Issue: Page doesn't load after `npm run dev`

**Solutions:**

1. Check terminal output for errors
2. Verify Node version: `node --version` (should be 16+)
3. Clear browser cache: Ctrl+Shift+Delete
4. Try in private/incognito mode
5. Restart dev server: `npm run dev`

---

### Issue: Changes not reflecting in browser

**Cause:** Vite caching

**Solutions:**
```bash
# Restart dev server
npm run dev

# Or hard refresh browser
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)
```

---

## Local PvP Mode

### Issue: "Move is invalid" when cell is empty

**Possible Causes:**

1. **Wrong sub-board:** You're not playing in the active sub-board
   - Check the green-highlighted board
   - Play there

2. **Cell is occupied:** Visually might look empty
   - Refresh the page
   - Check browser console for errors

**Solution:**
- Look for the green ring around the active sub-board
- Only play cells in that sub-board
- If all cells in that sub-board are occupied, you get free play (green ring disappears)

---

### Issue: Game freezes or doesn't respond to clicks

**Cause:** Browser rendering issue

**Solutions:**
1. Refresh page: F5
2. Hard refresh: Ctrl+Shift+R
3. Clear cache:
   - Open DevTools (F12)
   - Application tab → Storage → Clear site data
4. Try different browser

---

### Issue: "You must place a mark on the Macro Board first!"

**Cause:** You won a sub-board and need to make a macro move

**Solution:**
- Look at the Macro Board (right sidebar)
- Click an empty cell in the 3x3 Macro Board
- This is required after winning a sub-board

---

## Online Mode & Supabase

### Issue: "Cannot connect to Supabase" / Fails to create game

**Possible Causes:**

1. **Missing environment variables**
   ```bash
   # Check .env.local exists with:
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   ```

2. **Wrong credentials**
   - Double-check URL (should end with `.supabase.co`)
   - Verify Anon Key is not truncated
   - Get fresh credentials from Supabase dashboard

3. **Supabase project not initialized**
   - Go to https://app.supabase.com
   - Verify project exists and is active
   - Check that `games` table exists

**Solution:**
```bash
# 1. Create/update .env.local
echo 'VITE_SUPABASE_URL=your_url' > .env.local
echo 'VITE_SUPABASE_ANON_KEY=your_key' >> .env.local

# 2. Restart dev server
npm run dev

# 3. Try again
```

---

### Issue: Share link doesn't work / 404 error

**Cause:** URL parameters not properly encoded

**Solutions:**

1. Check URL format:
   ```
   http://localhost:5173/?gameId=12345678&playerId=O
   ```

2. Manually join with ID:
   - Click "Join a Game"
   - Paste the game ID
   - Select player (X or O)

3. Check browser console for errors

---

### Issue: "Game not found" when joining

**Causes:**

1. **Wrong game ID:** ID doesn't exist in database
2. **Game deleted:** Host ended the game
3. **Database connection failed**

**Solution:**
```javascript
// Test connection in browser console:
// (if you have Supabase client exposed)

// Or check Supabase dashboard → Table Editor → games
// Verify the game entry exists
```

---

### Issue: Real-time multiplayer not syncing

**Cause:** Supabase Realtime not enabled or not subscribed

**Solutions:**

1. **Enable Realtime on games table:**
   - Supabase dashboard → Replication
   - Toggle the `games` table
   - Select: Inserts, Updates, Deletes

2. **Check browser console for errors:**
   - F12 → Console tab
   - Look for "Realtime" or "socket" errors
   - Check for CORS errors

3. **Wait 5 seconds between moves:**
   - Realtime updates take 1-2 seconds
   - Don't make moves faster than sync can handle

4. **Check network:**
   - F12 → Network tab
   - Look for failed requests to `supabase.co`
   - Check CORS headers

---

### Issue: Database errors with custom schema

**Cause:** Database table structure doesn't match expected schema

**Solution:**

Check table structure:
```sql
-- In Supabase SQL Editor
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name='games';
```

Should include:
- `id` (UUID)
- `board_state` (JSONB)
- `sub_winners` (JSONB)
- `macro_board` (JSONB)
- `active_sub_board` (INT)
- `current_turn` (CHAR)
- `winner` (CHAR)
- `status` (TEXT)

---

## Performance Issues

### Issue: Game is slow / Lagging

**Causes:**

1. **Large board state in memory**
   - Normal (only 81 cells)
   - Check browser memory: F12 → Performance

2. **Network latency (online mode)**
   - Check internet connection
   - Switch to 2.4GHz WiFi
   - Restart router

3. **Browser issues**
   - Too many background processes
   - Browser extensions causing slowdown
   - Try different browser

**Solutions:**
```bash
# Optimize bundle (production only)
npm run build

# Check bundle size
npm install -g webpack-bundle-analyzer
```

---

### Issue: High CPU usage

**Cause:** Infinite re-renders or subscriptions

**Solutions:**

1. Check React DevTools:
   - Install React DevTools browser extension
   - Check for re-rendering issues

2. Restart dev server:
   ```bash
   npm run dev
   ```

3. Check for memory leaks:
   - F12 → Memory tab
   - Take heap snapshot
   - Look for growing arrays/objects

---

## Browser Compatibility

### Issue: Game doesn't work in Safari/Firefox/Edge

**Cause:** Might be unsupported features

**Solution:**
- Try different browser
- Check console (F12) for errors
- Test in Chrome first to isolate issue

---

## Styling & Display Issues

### Issue: Board looks distorted / Off-center

**Cause:** CSS issue or viewport width too small

**Solutions:**

1. Refresh page: F5
2. Check window size (should be 1024px+ width)
3. Check responsive breakpoints:
   - Open DevTools (F12)
   - Click device toolbar
   - Select different device to test

4. Clear Tailwind cache:
   ```bash
   npm run build
   npm run dev
   ```

---

### Issue: Colors look wrong / Dark mode not working

**Cause:** Tailwind not compiling

**Solutions:**

1. Check `tailwind.config.js` is in root:
   ```bash
   ls tailwind.config.js  # Should exist
   ```

2. Rebuild:
   ```bash
   npm run dev  # Restart server
   ```

3. Hard refresh:
   - Ctrl+Shift+R (Windows/Linux)
   - Cmd+Shift+R (Mac)

---

## Game Logic Issues

### Issue: Invalid move detected when it should be valid

**Debug Steps:**

1. Check active sub-board:
   - Look for green ring
   - Click cells only within that board

2. Check cell occupancy:
   - Cells with X or O are occupied
   - Only empty cells can be played

3. Check Wildcard rule:
   - If target sub-board is full (all 9 cells)
   - You get free play (no green ring)
   - Can play anywhere

4. Check console for validation details:
   ```javascript
   // Browser developer tools → Console
   // Look for validateMove errors
   ```

---

### Issue: Sub-board shows won but game continues

**Cause:** This is intentional! Non-Lock Rule

**Explanation:**
- Once a sub-board is won, it's marked
- But you can still play in that sub-board
- The moves count on the board but don't change the winner
- Game continues normally

This is a strategic feature, not a bug!

---

### Issue: Macro Board move didn't work

**Solutions:**

1. Check board is active:
   - Should see "Place on Macro Board!" alert
   - Macro Board should be highlighted

2. Check cell is empty:
   - Only empty cells can be marked
   - Cells with X or O are locked

3. Try clicking a different cell:
   - Some cells might be inactive
   - Try top-left cell (index 0)

---

## Database Issues

### Issue: Game data not persisting

**Cause:** Database not connected or write failed

**Solutions:**

1. Check database exists:
   - Supabase dashboard → Table Editor
   - Look for `games` table

2. Check Realtime is enabled:
   - Settings → Replication
   - See if `games` table is listed

3. Check browser console:
   - F12 → Console
   - Look for database error messages

4. Test connection:
   - Create new game
   - Check Supabase Table Editor
   - Should see new row appear

---

### Issue: "RLS policy denied insert"

**Cause:** Row-level security blocking operations

**Solution:**

Check Supabase dashboard:
- Settings → RLS Policies
- Verify `games_all_access` policy exists
- Should allow all operations (for demo)

For production, implement proper auth!

---

## Getting Help

### Before asking for help, collect:

1. **Error message:** Copy exact text from console
2. **Browser:** Chrome, Firefox, Safari, Edge?
3. **OS:** Windows, Mac, Linux?
4. **Mode:** Local PvP or Online?
5. **Steps to reproduce:** How to trigger the issue?

### Debug checklist:

- [ ] Restarted dev server
- [ ] Hard refreshed browser (Ctrl+Shift+R)
- [ ] Checked browser console (F12)
- [ ] Cleared node_modules: `rm -rf node_modules && npm install`
- [ ] Updated dependencies: `npm update`
- [ ] Checked .env.local for online mode
- [ ] Verified Supabase table exists
- [ ] Tested in different browser

---

## Quick Fixes

**Game not responding:**
```bash
npm run dev
```

**Styling broken:**
```bash
npm run build
npm run dev
```

**Supabase connection fails:**
- Check .env.local
- Restart dev server
- Wait 5 seconds
- Try again

**Everything broken:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## Still Having Issues?

1. Check [README.md](./README.md) for overview
2. Check [SETUP.md](./SETUP.md) for Supabase configuration
3. Check [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for code organization
4. Review [RULES.md](./RULES.md) for game rules
5. Search for similar issues online
6. Post detailed error logs and steps to reproduce

Good luck! 🎮
