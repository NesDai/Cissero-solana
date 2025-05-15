import { addDoc, collection, deleteDoc, getDocs, updateDoc } from "firebase/firestore";
import {db} from "../../../firebase";
import {doc, getDoc} from "@firebase/firestore";
// Users

// Fetch all users as list

// Fetch all
export async function getUsers() {
    try {
        const querySnapshot = await getDocs(collection(db, "users"));
        return querySnapshot.docs.map((doc) => doc.data());
    } catch (error) {
        console.error(error);
        return null
    }
}

// Fetch user list
export async function getAllUser(): Promise<string[]> {
    try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const userIds: string[] = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.userId) {
                userIds.push(data.userId);
            }
        });

        return userIds;
    } catch (error) {
        console.error("Error fetching user IDs:", error);
        return [];
    }
}


// Users
// change username
export async function updateUserId(docId: string, newUserId: string): Promise<boolean> {
    try {
        const userDocRef = doc(db, "users", docId);
        await updateDoc(userDocRef, { userId: newUserId });
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

// get personal info
export async function getUser(id: string) {
    try {
        const userDocRef = doc(db, "users", id);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            return userDocSnap.data();
        }
        return null;

    } catch (error) {
        console.error(error);
        return null;
    }
}

// get username by name
// export async function getUserByUserId(userId: string) {
//     try {
//         const usersRef = collection(db, "users");
//         const q = query(usersRef, where("userId", "==", userId));
//         const querySnapshot = await getDocs(q);
//
//         if (querySnapshot.empty) {
//             return null;
//         }
//
//         // Assuming userId is unique, return the first matching document
//         return querySnapshot.docs[0].data();
//     } catch (error) {
//         console.error("Error fetching user by userId:", error);
//         return null;
//     }
// }

// get all username
export async function getAllUserIds() {
    try {
        const usersRef = collection(db, "users");
        const snapshot = await getDocs(usersRef);
         // remove undefined entries if any
        return snapshot.docs
            .map(doc => doc.data().userId)
            .filter(userId => userId !== undefined);
    } catch (error) {
        console.error("Error getting all userIds:", error);
        return [];
    }
}

// Matches
// Create match
export async function createMatch(
    name: string,
    startDate: Date,
    endDate: Date,
    streamer1: string,
    streamer2: string
): Promise<boolean> {
    try {
        const docRef = await addDoc(collection(db, "matches"), {
            matchName: name,
            startDateTime: startDate,
            endDateTime: endDate,
            streamer1: streamer1,
            streamer2: streamer2,
            streamer1Link: "",
            streamer2Link: "",
            winner: "",
            admin: "",
            marketStatus: "",
            revenue: [],
            statistics: [],
            bettors: [],
            totalPool: []
        });

        await updateDoc(docRef, {
            matchId: docRef.id
        });

        return true;
    } catch (error) {
        console.error("Error creating match:", error);
        return false;
    }
}

// Delete match
export async function deleteMatch(matchId: string): Promise<boolean> {
    try {
        const matchDocRef = doc(db, "matches", matchId);
        await deleteDoc(matchDocRef);
        return true;
    } catch (error) {
        console.error("Error deleting match:", error);
        return false;
    }
}

// Update match
export async function updateMatchLinks(
    matchId: string,
    streamer1Link: string,
    streamer2Link: string
): Promise<boolean> {
    try {
        const matchDocRef = doc(db, "matches", matchId);
        await updateDoc(matchDocRef, {
            streamer1Link,
            streamer2Link
        });
        return true;
    } catch (error) {
        console.error("Error updating match links:", error);
        return false;
    }
}

// Update statistics (admin only)
export async function updateMatchStatistics(
    matchId: string,
    statistics: string,
    adminId: string
): Promise<boolean> {
    try {
        const adminDocRef = doc(db, "admin", adminId);
        const adminDocSnap = await getDoc(adminDocRef);

        if (!adminDocSnap.exists()) {
            console.warn("Unauthorized: Admin ID not found");
            return false;
        }

        const matchDocRef = doc(db, "matches", matchId);
        await updateDoc(matchDocRef, {
            statistics,
            admin: adminId
        });

        return true;
    } catch (error) {
        console.error("Error updating match statistics:", error);
        return false;
    }
}

// End and calculate match spoils (admin/streamer only)
// TODO

// Fetch all match
export async function getAllMatchSummary() {
    try {
        const querySnapshot = await getDocs(collection(db, "matches"));

        const matches = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                matchId: data.matchId || doc.id,
                matchName: data.matchName || "",
                startDateTime: data.startDateTime || null,
                endDateTime: data.endDateTime || null,
                streamer1: data.streamer1 || "",
                streamer2: data.streamer2 || ""
            };
        });

        return matches;
    } catch (error) {
        console.error("Error fetching match summaries:", error);
        return [];
    }
}

// Fetch match by name


// Type for Match Data
// interface MatchData {
//     matchId: string;
//     matchName: string;
//     startDateTime: Date;
//     endDateTime: Date;
//     streamer1: string;
//     streamer2: string;
// }

// export async function getOngoingMatches(): Promise<MatchData[]> {
//     try {
//         const now = new Date();
//         const matchesRef = collection(db, "matches");
//         // @ts-ignore
//         const q = query(
//             matchesRef,
//             where("startDateTime", "<=", now),  // match has started
//             where("endDateTime", ">=", now)     // match has not ended
//         );
//
//         const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);
//         const matches: MatchData[] = querySnapshot.docs.map(doc => {
//             const data = doc.data() as MatchData; // Type cast to MatchData
//             return {
//                 matchId: data.matchId || doc.id,
//                 matchName: data.matchName || "",
//                 startDateTime: data.startDateTime || new Date(),
//                 endDateTime: data.endDateTime || new Date(),
//                 streamer1: data.streamer1 || "",
//                 streamer2: data.streamer2 || ""
//             };
//         });
//
//         return matches;
//     } catch (error) {
//         console.error("Error fetching ongoing matches:", error);
//         return [];
//     }
// }

// Fetch match by status (ongoing, upcoming)
// export async function getUpcomingMatches(): Promise<MatchData[]> {
//     try {
//         const now = new Date();
//         const matchesRef = collection(db, "matches");
//         // @ts-expect-error
//         const q = query(
//             matchesRef,
//             where("startDateTime", ">", now)  // match is in the future
//         );
//
//         // @ts-expect-error
//         const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);
//         const matches: MatchData[] = querySnapshot.docs.map((doc: { data: () => MatchData; id: never; }) => {
//             const data = doc.data() as MatchData; // Type cast to MatchData
//             return {
//                 matchId: data.matchId || doc.id,
//                 matchName: data.matchName || "",
//                 startDateTime: data.startDateTime || new Date(),
//                 endDateTime: data.endDateTime || new Date(),
//                 streamer1: data.streamer1 || "",
//                 streamer2: data.streamer2 || ""
//             };
//         });
//
//         return matches;
//     } catch (error) {
//         console.error("Error fetching upcoming matches:", error);
//         return [];
//     }
// }

// Fetch match by id
// export async function getMatchById(matchId: string) {
//     try {
//         const matchDocRef = doc(db, "matches", matchId);
//         const docSnap = await getDoc(matchDocRef);
//         if (!docSnap.exists()) {
//             console.log("No match found with the given ID");
//             return null;
//         }
//
//         return docSnap.data();
//     } catch (error) {
//         console.error("Error fetching match by ID:", error);
//         return null;
//     }
// }

// Fetch match by id (live)
// export function getLiveMatchById(matchId: string, callback: (data: any | null) => void): () => void {
//     try {
//         // Reference to the document by matchId (which is the same as the document ID)
//         const matchDocRef = doc(db, "matches", matchId);
//
//         // Listen to real-time updates on the document
//         const unsubscribe = onSnapshot(matchDocRef, (docSnap) => {
//             if (docSnap.exists()) {
//                 // Call the callback with the updated data when the document changes
//                 callback(docSnap.data());
//             } else {
//                 // If no document is found, pass null to the callback
//                 callback(null);
//             }
//         });
//
//         // Return the unsubscribe function to stop listening
//         return unsubscribe;
//     } catch (error) {
//         console.error("Error fetching live match by ID:", error);
//         callback(null);
//         return () => {}; // Return a noop function if there's an error
//     }
// }

// Sample usage refer match-details-test