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
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                const userDocRef = doc(db, "users", currentUser.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (!userDocSnap.exists()) {
                    const newUserData = await setDoc(userDocRef, {
                        email: currentUser.email,
                        userId: currentUser.uid,
                    })
                    setUserData(newUserData);
                }
                else {
                    setUserData(userDocSnap.data());
                }
            }
            else {
                setUserData(null);
            }
        });
        return () => unsubscribe();
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, userData }}>
            {children}
        </AuthContext.Provider>
    );
};

export const UserAuth = () => {
    return useContext(AuthContext);
};