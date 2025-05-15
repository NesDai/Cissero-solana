'use client'
import { useContext, createContext, useState, useEffect } from "react";
import {
    onAuthStateChanged,
} from "firebase/auth";
import {auth, db} from "../../../firebase";
import {doc, getDoc, setDoc} from "@firebase/firestore";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);

                // Check if user is in "admin" collection
                const adminDocRef = doc(db, "admins", currentUser.uid);
                const adminDocSnap = await getDoc(adminDocRef);
                setIsAdmin(adminDocSnap.exists());

                const userDocRef = doc(db, "users", currentUser.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (!userDocSnap.exists()) {
                    await setDoc(userDocRef, {
                        email: currentUser.email,
                        userId: "user-"+currentUser.uid,
                        transaction: [{id: 2, revenue: 0.0001}, {id: 3, revenue: 0.0002}],
                        pastMatches: [{id: 1, outcome: "won", revenue: 0.0001}, {id: 5, outcome: "lost", revenue: -0.0001}],
                        won: 0,
                        lost: 0,
                        rank: "unranked",
                        follower: 0
                    })
                }
            }
            else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const UserAuth = () => {
    return useContext(AuthContext);
};