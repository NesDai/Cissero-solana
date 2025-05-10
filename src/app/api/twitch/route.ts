import { NextRequest, NextResponse } from "next/server";
import { getTopStreams, getStreamByUsername } from "@/services/twitchService";

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

      const stream = await getStreamByUsername(username);
      return NextResponse.json({ stream });
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
