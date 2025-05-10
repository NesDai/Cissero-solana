import {collection, getDocs, updateDoc} from "firebase/firestore";
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
export async function getAllUserIds(): Promise<string[]> {
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

// get all username

// Matches
// Create match

// Delete match

// Update match

// End and calculate match spoils

// Fetch all match

// Fetch match by name

// Fetch match by status (ongoing, upcoming)

// Fetch match by id

