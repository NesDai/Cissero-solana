// Twitch API service for dashboard integration

interface TwitchCredentials {
  clientId: string;
  clientSecret: string;
  accessToken: string;
  expiresAt: number;
}

// Store credentials (in a real app, use a more secure method)
let credentials: TwitchCredentials | null = null;

/**
 * Get an access token from Twitch
 */
async function getAccessToken(): Promise<string> {
  // Check if we have a valid token
  if (credentials && credentials.expiresAt > Date.now()) {
    return credentials.accessToken;
  }

  // Get new token
  const clientId = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Twitch credentials not configured");
  }

  const response = await fetch(`https://id.twitch.tv/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials",
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to get Twitch access token: ${response.statusText}`
    );
  }

  const data = await response.json();

  // Store the token
  credentials = {
    clientId,
    clientSecret,
    accessToken: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };

  return credentials.accessToken;
}

/**
 * Make an authenticated request to the Twitch API
 */
async function twitchApiRequest<T>(
  endpoint: string,
  params: Record<string, string> = {}
): Promise<T> {
  const accessToken = await getAccessToken();
  const clientId = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID;

  if (!clientId) {
    throw new Error("Twitch client ID not configured");
  }

  // Build URL with query parameters
  const url = new URL(`https://api.twitch.tv/helix/${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  const response = await fetch(url.toString(), {
    headers: {
      "Client-ID": clientId,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Twitch API error: ${response.statusText}`);
  }

  return response.json();
}

// Types for Twitch API responses
export interface TwitchStream {
  id: string;
  user_id: string;
  user_login: string;
  user_name: string;
  game_id: string;
  game_name: string;
  type: string;
  title: string;
  viewer_count: number;
  started_at: string;
  language: string;
  thumbnail_url: string;
  tag_ids: string[];
  is_mature: boolean;
}

export interface TwitchUser {
  id: string;
  login: string;
  display_name: string;
  type: string;
  broadcaster_type: string;
  description: string;
  profile_image_url: string;
  offline_image_url: string;
  view_count: number;
  created_at: string;
}

// Add TwitchGame interface
export interface TwitchGame {
  id: string;
  name: string;
  box_art_url: string;
}

/**
 * Get top streams
 */
export async function getTopStreams(
  gameId?: string,
  limit = 10
): Promise<TwitchStream[]> {
  const params: Record<string, string> = {
    first: limit.toString(),
  };

  if (gameId) {
    params.game_id = gameId;
  }

  const response = await twitchApiRequest<{ data: TwitchStream[] }>(
    "streams",
    params
  );
  return response.data;
}

/**
 * Get user information by user IDs
 */
export async function getUsersByIds(userIds: string[]): Promise<TwitchUser[]> {
  if (userIds.length === 0) return [];

  const params: Record<string, string> = {};
  userIds.forEach((id) => {
    params[`id`] = id;
  });

  const response = await twitchApiRequest<{ data: TwitchUser[] }>(
    "users",
    params
  );
  return response.data;
}

/**
 * Get user information by usernames
 */
export async function getUsersByNames(
  usernames: string[]
): Promise<TwitchUser[]> {
  if (usernames.length === 0) return [];

  const params: Record<string, string> = {};
  usernames.forEach((name) => {
    params[`login`] = name;
  });

  const response = await twitchApiRequest<{ data: TwitchUser[] }>(
    "users",
    params
  );
  return response.data;
}

/**
 * Get games by IDs
 */
export async function getGamesByIds(gameIds: string[]): Promise<TwitchGame[]> {
  if (gameIds.length === 0) return [];

  const params: Record<string, string> = {};
  gameIds.forEach((id) => {
    params[`id`] = id;
  });

  const response = await twitchApiRequest<{ data: TwitchGame[] }>(
    "games",
    params
  );
  return response.data;
}

/**
 * Get games by names
 */
export async function getGamesByNames(
  gameNames: string[]
): Promise<TwitchGame[]> {
  if (gameNames.length === 0) return [];

  const params: Record<string, string> = {};
  gameNames.forEach((name) => {
    params[`name`] = name;
  });

  const response = await twitchApiRequest<{ data: TwitchGame[] }>(
    "games",
    params
  );
  return response.data;
}

/**
 * Get stream information for a specific user
 */
export async function getStreamByUserId(
  userId: string
): Promise<TwitchStream | null> {
  const response = await twitchApiRequest<{ data: TwitchStream[] }>("streams", {
    user_id: userId,
  });
  return response.data.length > 0 ? response.data[0] : null;
}

/**
 * Search for categories (games)
 */
export async function searchCategories(
  query: string,
  limit = 10
): Promise<TwitchGame[]> {
  const response = await twitchApiRequest<{ data: TwitchGame[] }>(
    "search/categories",
    { query, first: limit.toString() }
  );
  return response.data;
}
