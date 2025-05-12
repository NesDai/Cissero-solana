'use client'
import { useState, useEffect } from "react";
import {getLiveMatchById} from "@/lib/firebase/api";

const MatchPage = () => {
    const [matchId, setMatchId] = useState<string>(""); // Store matchId input
    const [matchData, setMatchData] = useState<any | null>(null); // Store match data
    const [loading, setLoading] = useState<boolean>(false); // Loading state

    useEffect(() => {
        if (!matchId) return;

        // Define a callback to handle real-time updates
        const handleMatchUpdate = (data: any | null) => {
            if (data) {
                setMatchData(data); // Update state with new data
            } else {
                console.log("Match not found");
                setMatchData(null); // Reset state if no match is found
            }
        };

        // Start listening for real-time updates on the match document
        const unsubscribe = getLiveMatchById(matchId, handleMatchUpdate);

        // Cleanup listener when component unmounts or matchId changes
        return () => {
            unsubscribe();
        };
    }, [matchId]); // Re-run effect when matchId changes

    const handleMatchIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMatchId(e.target.value); // Update matchId state when user types
    };

    const formatDate = (timestamp: any) => {
        // Check if the timestamp is valid and has the toDate method
        if (timestamp && timestamp.toDate) {
            return timestamp.toDate().toString(); // Convert to Date object and return string
        }
        return "Invalid Date"; // Fallback message for invalid timestamp
    };

    return (
        <div>
            <h1>Match Details</h1>
            <p>test id is 5pIm9r8QoW8qUJego4gt</p>

            <div>
                <label htmlFor="matchId">Enter Match ID: </label>
                <input
                    type="text"
                    id="matchId"
                    value={matchId}
                    onChange={handleMatchIdChange}
                    placeholder="Enter match ID"
                />
            </div>

            {loading ? (
                <p>Loading match data...</p>
            ) : matchData ? (
                <div>
                    <h2>{matchData.matchName}</h2>
                    <p>Start: {formatDate(matchData.startDatetime)}</p>
                    <p>End: {formatDate(matchData.endDatetime)}</p>
                    <p>Streamer 1: {matchData.streamer1}</p>
                    <p>Streamer 2: {matchData.streamer2}</p>
                </div>
            ) : (
                <p>Match data not available. Please enter a valid Match ID.</p>
            )}
        </div>
    );
};

export default MatchPage;