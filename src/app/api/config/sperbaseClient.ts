import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export { supabase};

export async function db(email: string, accessToken: string, refreshToken: string, expiry: number,historyId: string) {
  const { data, error } = await supabase.from('users').upsert({
    email: email,
    access_token: accessToken,
    refresh_token: refreshToken,
    expiry: expiry,
    history_id : historyId
  });

  if (error) {
    console.error('Supabase insert error:', error);
    return { success: false, error };
  }

  return { success: true, data };
}
