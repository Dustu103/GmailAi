import { google } from 'googleapis';
import { supabase } from '../config/sperbaseClient'; // Adjust the import based on your project structure

export async function refreshAccessToken(email: string, refreshToken: string, currentHistoryId: string) {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  try {
    const { credentials } = await oauth2Client.refreshAccessToken();
    const { access_token, refresh_token, expiry_date } = credentials;

    // Update the access token and keep the historyId
    await updateUserCredentials(email, access_token!, refresh_token!, expiry_date!, currentHistoryId);

    return access_token;
  } catch (err) {
    console.error('Error refreshing access token:', err);
    return null;
  }
}


// interface User {
//   email: string;
//   access_token: string;
//   refresh_token: string;
//   expiry_date: number;
//   history_id: string;
// }

// Function to update user credentials
export async function updateUserCredentials(
  email: string,
  accessToken: string,
  refreshToken: string,
  expiryDate: number,
  historyId: string
) {
  const { data, error } = await supabase
    .from('users')
    .upsert([
      {
        email,
        access_token: accessToken,
        refresh_token: refreshToken,
        expiry_date: expiryDate,
        history_id: historyId, // Preserve the historyId
      },
    ]);

  if (error) {
    console.error('Error updating user credentials:', error);
  }

  return data;
}

// Function to get all users (for periodic token refresh)
export async function getUsers() {
  const { data, error } = await supabase.from('users').select('*');
  if (error) {
    console.error('Error fetching users:', error);
  }
  return data;
}

// Function to update the historyId after fetching emails
export async function updateHistoryId(email: string, newHistoryId: string) {
  const { data, error } = await supabase
    .from('users')
    .update({ history_id: newHistoryId })
    .eq('email', email);

  if (error) {
    console.error('Error updating historyId:', error);
  }

  return data;
}
