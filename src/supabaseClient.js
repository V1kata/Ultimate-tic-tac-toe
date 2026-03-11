import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// Make sure to set these environment variables in .env:
// VITE_SUPABASE_URL=your_supabase_url
// VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

const SUPABASE_URL = import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('Supabase credentials not configured. Online play will not work.');
}

export const supabase = createClient(SUPABASE_URL || '', SUPABASE_ANON_KEY || '');

/**
 * Create a new game in the database
 */
export const createGame = async (gameData) => {
  const { data, error } = await supabase
    .from('games')
    .insert([gameData])
    .select();

  if (error) throw error;
  return data[0];
};

/**
 * Get a game by ID
 */
export const getGame = async (gameId) => {
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('id', gameId)
    .single();

  if (error) throw error;
  return data;
};

/**
 * Update game state
 */
export const updateGame = async (gameId, updates) => {
  const { data, error } = await supabase
    .from('games')
    .update(updates)
    .eq('id', gameId)
    .select();

  if (error) throw error;
  return data[0];
};

/**
 * Subscribe to real-time game updates
 * Returns an unsubscribe function
 */
export const subscribeToGameUpdates = (gameId, callback) => {
  const subscription = supabase
    .channel(`game:${gameId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'games',
        filter: `id=eq.${gameId}`
      },
      (payload) => {
        callback(payload.new);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
};

/**
 * Delete a game
 */
export const deleteGame = async (gameId) => {
  const { error } = await supabase
    .from('games')
    .delete()
    .eq('id', gameId);

  if (error) throw error;
};

/**
 * Get all games with a specific status
 */
export const getGamesByStatus = async (status) => {
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('status', status);

  if (error) throw error;
  return data;
};
