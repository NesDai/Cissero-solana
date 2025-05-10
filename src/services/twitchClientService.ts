// Client-side service for Twitch data
import { TwitchStream, TwitchUser } from "./twitchService";

/**
 * Get top streams
 */
export async function getTopStreams(
  gameId?: string,
  limit = 10
): Promise<TwitchStream[]> {
  const params = new URLSearchParams({
    action: "topStreams",
    limit: limit.toString(),
  });

  if (gameId) {
    params.append("gameId", gameId);
  }

  const response = await fetch(`/api/twitch?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch top streams: ${response.statusText}`);
  }

  const data = await response.json();
  return data.streams;
}

/**
 * Get stream information for a specific user
 */
export async function getStreamByUsername(
  username: string
): Promise<TwitchStream | null> {
  const params = new URLSearchParams({
    action: "streamByUsername",
    username,
  });

  const response = await fetch(`/api/twitch?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch stream: ${response.statusText}`);
  }

  const data = await response.json();
  return data.stream;
}
