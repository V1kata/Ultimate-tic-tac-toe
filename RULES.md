# Ultimate Tic-Tac-Toe with Macro Board - Game Rules & Strategy

## Complete Game Rules

### Objective
Be the first player to get **3-in-a-row on the Macro Board** to win the game.

### Board Hierarchy

```
Macro Board (3x3 grid of Sub-Board outcomes)
    ↓
9 Sub-Boards (each is a 3x3 grid)
    ↓
81 Micro Cells
```

### Move Sequence

#### Phase 1: Make a Micro Move

1. **Check the active sub-board** (shown by green highlighting)
2. **Place your mark** (X or O) in an empty cell within that sub-board
3. **Move determines next board**: The cell index % 9 = target sub-board for opponent
   - Example: You place at index 24 → Next player plays in sub-board 24 % 9 = 6

#### Phase 2: Check for Sub-Board Win

When you make a move:
1. Check if you got 3-in-a-row in that sub-board
2. If **YES** → You get a "Reward Move" on the Macro Board (continue to Phase 3)
3. If **NO** → Next player's turn (opponent moves in Phase 1)

#### Phase 3: Reward Move (Macro Board)

Only triggered when you win a sub-board:
1. UI highlights the Macro Board
2. **Choose an empty cell on the Macro Board** to place your mark
3. Check if you got 3-in-a-row on Macro Board
   - If **YES** → You win the game! 🎉
   - If **NO** or **DRAW** → Next player's turn

### Special Rules

#### Non-Lock Rule

**You can still play in a Sub-Board that's already been won or drawn.**

- The move is recorded on the micro level
- But it **does NOT change** the Sub-Board winner
- This allows continuous gameplay even if fields are "locked"

Example:
- Sub-Board 3 is won by Player X
- Player O still wants to play in Sub-Board 3
- ✓ Allowed! The move counts on the board but doesn't change the winner

#### Wildcard Rule (Free Play)

**If the target sub-board is 100% full**, the current player gets **free play**:

- `active_sub_board` becomes `null`
- You can place your mark in ANY non-full sub-board
- This ensures the game never gets stuck

Example sequence:
1. You play at index 15
2. Next player should play in sub-board 6 (15 % 9 = 6)
3. But sub-board 6 is completely full (all 9 cells occupied)
4. Next player gets free play! They can play anywhere

### Win Conditions

**Player wins when:**
- Getting 3-in-a-row on the Macro Board (horizontally, vertically, or diagonally)

**Draw occurs when:**
- All 9 cells on the Macro Board are filled but no one got 3-in-a-row
- (This is unlikely but possible with perfect play)

---

## Strategic Gameplay Tips

### Opening Strategy

1. **Choose your opening move carefully**
   - Your move determines opponent's sub-board
   - Try to direct them to a difficult area
   - Avoid giving them the center sub-board immediately

2. **Center is Powerful**
   - Winning the center sub-board (index 4) is valuable
   - It gives you presence in the geometric center of Macro Board

### Mid-Game Strategy

1. **Plan Two Moves Ahead**
   - Think: "If I win sub-board X, where will I place on Macro Board?"
   - Position yourself to threaten multiple winning lines

2. **Sub-Board Wins vs. Macro Progress**
   - Every sub-board win forces a Macro move
   - Try to alternate between offense and defense
   - Prevent opponent from building dangerous Macro positions

3. **Use Free Play Strategically**
   - When Wildcard is activated, you have flexibility
   - Can move away from opponent's setup
   - Can move to a sub-board you're winning in

4. **Block, Block, Block**
   - Just like regular Tic-Tac-Toe, blocking is crucial
   - Watch opponent's Macro patterns
   - Stop them from getting 2-in-a-row

### Advanced Tactics

1. **Forced Sequences**
   - Win sub-boards strategically to position yourself on the Macro Board
   - Force opponent into sub-boards where you're strong

2. **Diagonal Control**
   - Sub-boards 0, 4, 8 form main diagonal
   - Sub-boards 2, 4, 6 form anti-diagonal
   - These are valuable for Macro Board control

3. **Corners vs. Center**
   - Corner Macro wins (0, 2, 6, 8): Easier to block
   - Center row/column wins: Harder to intercept
   - Plan accordingly

4. **Tempo & Rhythm**
   - Control the flow of the game
   - Don't let opponent finish their Macro sequences
   - Use free plays to interrupt their strategy

---

## Example Game Walkthrough

**Player X's Turn 1:**
- Places mark in Sub-Board 0, Cell 4 (index 4)
- No winner in Sub-Board 0, no Macro move
- Next player (O) plays in Sub-Board 4 % 9 = 4

**Player O's Turn 1:**
- Places mark in Sub-Board 4, Cell 1 (index 37)
- No winner in Sub-Board 4, no Macro move
- Next player (X) plays in Sub-Board 37 % 9 = 1

**Player X's Turn 2:**
- Places mark in Sub-Board 1, Cell 4 (index 13)
- Gets 3-in-a-row in Sub-Board 1! ✓
- **Reward Move activated!**
- Player X chooses to place on Macro Board, selects cell 1
- No winner on Macro Board yet
- Next player (O) would play in Sub-Board 13 % 9 = 4

**Player O's Turn 2:**
- Wants to play in Sub-Board 4
- But Sub-Board 4 is full (all 9 cells occupied)
- **Wildcard Rule triggered!**
- Player O can play in any non-full sub-board
- Chooses Sub-Board 2

And so on...

---

## Quick Reference

### Winning Combinations (3-in-a-row)

**Rows:** 0-1-2, 3-4-5, 6-7-8  
**Columns:** 0-3-6, 1-4-7, 2-5-8  
**Diagonals:** 0-4-8, 2-4-6

Same pattern applies to:
- Individual 3x3 Sub-Boards (for sub-board wins)
- Macro Board 3x3 (for game victory)

### Index Mapping (Sub-Board Layout)

```
Sub-Board Indices:
0 | 1 | 2
---------
3 | 4 | 5
---------
6 | 7 | 8

Global Cell Indices (example for Sub-Board 4):
36 | 37 | 38
-----------
39 | 40 | 41
-----------
42 | 43 | 44
```

---

## Comparison to Regular Ultimate Tic-Tac-Toe

| Feature | Regular | With Macro Board |
|---------|---------|------------------|
| Win sub-board | Marks it as won | Allows Reward Move on Macro Board |
| Macro Board | Automatic tracking | Requires players to place moves |
| Game Length | ~40-50 moves | ~60-100 moves (more strategic depth) |
| Skill Cap | Medium | High (multiple layers of strategy) |
| Non-Lock Rule | Typically enabled | Emphasis on Free Play with Macro depth |

---

## Resources

- **Game Logic**: See `src/gameLogic.js` for implementation
- **UI Components**: See `src/components/` for visual guides
- **Database Schema**: See `SETUP.md` for Supabase structure

---

Enjoy the game and may the best strategist win! 🎮
