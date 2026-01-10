
import { createClient, User } from '@supabase/supabase-js';
import { AnalysisResult, AnalysisScope } from '../types';

const SUPABASE_URL = 'https://libeundcmwcmxdudwzwo.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_2uG3Xx0lX5WmyJAXojogGg_uMtIjSOh';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Authentication Methods
 */
export const signUp = async (email: string, password: string) => {
  return await supabase.auth.signUp({ email, password });
};

export const signIn = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

/**
 * Inquiry Submission
 */
export const submitInquiry = async (name: string, email: string, message: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase
      .from('inquiries')
      .insert([{ 
        name, 
        email, 
        message,
        user_id: user?.id || null 
      }]);
    
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error('Inquiry submission failed:', err.message);
    throw err;
  }
};

/**
 * Admin Panel Data Fetching
 */
export const getAllInquiries = async () => {
  const { data, error } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const getAllHistory = async () => {
  const { data, error } = await supabase
    .from('search_history')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const getAllCache = async () => {
  const { data, error } = await supabase
    .from('analyses_cache')
    .select('id, word, scope, created_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

/**
 * Helper to extract readable error message from Supabase error objects
 */
const getErrorMessage = (err: any): string => {
  if (typeof err === 'string') return err;
  if (err?.message) return err.message;
  if (err?.error_description) return err.error_description;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
};

/**
 * Check if the error indicates a missing table or column
 */
export const isTableMissingError = (err: any): boolean => {
  const msg = getErrorMessage(err).toLowerCase();
  return (
    msg.includes('could not find the table') || 
    (msg.includes('relation') && msg.includes('does not exist')) ||
    (msg.includes('column') && msg.includes('does not exist'))
  );
};

/**
 * Log a word to the search history table
 */
export const logSearchHistory = async (word: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from('search_history')
      .insert([{ 
        word, 
        user_id: user?.id || null // Link to user if logged in
      }]);
    
    if (error) {
      console.warn('Supabase history insert warning:', error.message);
    }
  } catch (err) {
    console.error('Supabase log connection failed:', getErrorMessage(err));
  }
};

/**
 * Fetch the latest 10 unique searches
 */
export const getRecentSearches = async (): Promise<string[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    let query = supabase
      .from('search_history')
      .select('word')
      .order('created_at', { ascending: false })
      .limit(50);
      
    // If logged in, prioritize user's own history
    if (user) {
      query = query.eq('user_id', user.id);
    } else {
      query = query.is('user_id', null);
    }

    const { data, error } = await query;

    if (error) {
      if (isTableMissingError(error)) {
        throw new Error('TABLE_MISSING');
      }
      console.error('Supabase query error:', error.message);
      return [];
    }
    
    if (!data) return [];
    
    const words: string[] = data.map(item => String(item.word));
    return [...new Set(words)].slice(0, 10);
  } catch (err: any) {
    if (err.message === 'TABLE_MISSING') throw err;
    console.error('Failed to fetch history from Supabase:', getErrorMessage(err));
    return [];
  }
};

/**
 * Try to get a cached analysis result from Supabase
 */
export const getCachedAnalysis = async (word: string, scope: AnalysisScope): Promise<AnalysisResult | null> => {
  try {
    const { data, error } = await supabase
      .from('analyses_cache')
      .select('result')
      .eq('word', word)
      .eq('scope', scope)
      .maybeSingle();

    if (error) {
      if (isTableMissingError(error)) return null;
      if (error.code !== 'PGRST116') {
        console.warn('Cache lookup error:', error.message);
      }
      return null;
    }

    return data?.result as AnalysisResult || null;
  } catch (err) {
    console.error('Cache connection error:', getErrorMessage(err));
    return null;
  }
};

/**
 * Cache an analysis result for future users
 */
export const cacheAnalysis = async (word: string, scope: AnalysisScope, result: any) => {
  try {
    const { error } = await supabase
      .from('analyses_cache')
      .upsert([{ word, scope, result }], { onConflict: 'word,scope' });
    
    if (error) {
      console.warn('Cache storage warning:', error.message);
    }
  } catch (err) {
    console.error('Cache save failed:', getErrorMessage(err));
  }
};
