import { NextRequest, NextResponse } from "next/server";
import {
  getTopStreams,
  getStreamByUserId,
  getTopGames,
} from "@/services/twitchService";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get("action");

  try {
    if (action === "topStreams") {
      const gameId = searchParams.get("gameId") || undefined;
      const limit = parseInt(searchParams.get("limit") || "10");
      const streams = await getTopStreams(gameId, limit);
      return NextResponse.json({ streams });
    }

    if (action === "streamByUsername") {
      const username = searchParams.get("username");
      if (!username) {
        return NextResponse.json(
          { error: "Username is required" },
          { status: 400 }
        );
      }

      const mockStream = {
        id: "41375541868",
        user_id: "38746172",
        user_login: username,
        user_name: username,
        game_id: "743",
        game_name: "Chess",
        type: "live",
        title: `${username}'s Stream`,
        viewer_count: Math.floor(Math.random() * 10000),
        started_at: new Date().toISOString(),
        language: "en",
        thumbnail_url:
          "https://static-cdn.jtvnw.net/previews-ttv/live_user_chess-{width}x{height}.jpg",
        is_mature: false,
      };

      return NextResponse.json({ stream: mockStream });
    }

    if (action === "topGames") {
      const limit = parseInt(searchParams.get("limit") || "10");
      const games = await getTopGames(limit);
      return NextResponse.json({ games });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Twitch API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Twitch data" },
      { status: 500 }
    );
  }
}
