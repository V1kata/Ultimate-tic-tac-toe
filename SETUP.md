# Supabase Setup Guide

Follow these steps to set up the database for online multiplayer support.

## Step 1: Create a Supabase Project

1. Go to https://app.supabase.com
2. Click "New Project"
3. Fill in:
   - **Name**: "Ultimate Tic-Tac-Toe" (or your choice)
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your players
4. Wait for the project to initialize (2-3 minutes)

## Step 2: Create the Games Table

1. In the Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Paste the following SQL:

```sql
-- Create games table
CREATE TABLE IF NOT EXISTS public.games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_state JSONB NOT NULL,
  sub_winners JSONB NOT NULL,
  macro_board JSONB NOT NULL,
  active_sub_board INT,
  current_turn CHAR(1) NOT NULL,
  winner CHAR(1),
  last_move_index INT,
  status TEXT NOT NULL DEFAULT 'waiting',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS (Row Level Security) for Realtime
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow all operations (demo purposes)
-- WARNING: This is not secure for production!
CREATE POLICY "games_all_access" ON public.games
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create an index for faster lookups
CREATE INDEX IF NOT EXISTS idx_games_status ON public.games(status);
CREATE INDEX IF NOT EXISTS idx_games_created_at ON public.games(created_at DESC);

-- Create a function to auto-update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger for the timestamp
CREATE TRIGGER update_games_updated_at BEFORE UPDATE ON public.games
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

4. Click **Run** to execute

## Step 3: Enable Realtime

1. Go to **Replication** in the left sidebar
2. Under "Replication", toggle the switch for the `games` table
3. Click on `games` to expand
4. Select **Inserts**, **Updates**, and **Deletes**

## Step 4: Get Your Credentials

1. Go to **Settings** (gear icon)
2. Click **API**
3. Copy the following:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Anon Key** → `VITE_SUPABASE_ANON_KEY`

## Step 5: Configure Your Application

1. Create a `.env.local` file in your project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

2. Restart the development server:
```bash
npm run dev
```

## Verification

1. Start the game: `npm run dev`
2. Click "Host a Game" in Online Play
3. Check Supabase dashboard → **Table Editor** → `games`
4. You should see a new row created with your game data

## Database Schema Details

### games Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key, auto-generated |
| `board_state` | JSONB | Array of 81 elements (null/'X'/'O') |
| `sub_winners` | JSONB | Array of 9 elements (null/'X'/'O'/'Draw') |
| `macro_board` | JSONB | Array of 9 elements (null/'X'/'O') |
| `active_sub_board` | INT | 0-8 or null for wildcard play |
| `current_turn` | CHAR(1) | 'X' or 'O' |
| `winner` | CHAR(1) | null/'X'/'O'/'D' for draw |
| `last_move_index` | INT | Index of last micro move (used for macro board placement calculations) |
| `status` | TEXT | 'waiting'/'playing'/'finished' |
| `created_at` | TIMESTAMPTZ | Game creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

## Example Game State (JSON)

```json
{
  "id": "12345678-1234-1234-1234-123456789012",
  "board_state": [null, "X", null, null, "O", null, null, null, null, ...],
  "sub_winners": [null, "X", null, null, null, null, null, null, null],
  "macro_board": [null, "X", null, null, null, null, null, null, null],
  "active_sub_board": 6,
  "current_turn": "O",
  "last_move_index": 15,
  "winner": null,
  "status": "playing",
  "created_at": "2024-03-11T10:30:00Z",
  "updated_at": "2024-03-11T10:35:45Z"
}
```

## Troubleshooting

### Connection Errors
- ✓ Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
- ✓ Check that the url starts with `https://` and ends with `.supabase.co`
- ✓ Restart the dev server after adding .env variables

### Realtime Not Working
- ✓ Go to **Replication** settings and verify the `games` table is enabled
- ✓ Check that **Inserts**, **Updates**, and **Deletes** are all enabled
- ✓ Restart the development server

### RLS Policy Errors
- ✓ Check that the RLS policy is enabled on the games table
- ✓ For demo/testing purposes, the provided policy allows all access
- ✓ For production, create more restrictive policies based on user authentication

### Table Not Found
- ✓ Verify you ran the SQL script in the SQL Editor
- ✓ Go to **Table Editor** and confirm the `games` table exists
- ✓ Refresh the page if needed

## Security Notes (Important!)

⚠️ **The current setup is for demonstration purposes only.**

For production deployment, implement:
1. **User Authentication**: Use Supabase Auth
2. **Row Level Security Policies**: Restrict access to user's own games
3. **API Keys**: Use Service Role Key only on your backend

Example production policy:
```sql
CREATE POLICY "users_can_access_own_games" ON public.games
  FOR ALL
  USING (auth.uid() = created_by_user_id)
  WITH CHECK (auth.uid() = created_by_user_id);
```

## Next Steps

After setup:
1. Test local game first
2. Host an online game and verify database entry
3. Share the link with another player
4. Test real-time synchronization

Enjoy your game! 🎮
