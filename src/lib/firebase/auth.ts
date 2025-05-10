import { getAuth, signInWithPopup } from "firebase/auth";
import {provider} from "../../../firebase";

const auth = getAuth();

export async function loginWithGoogle() {
    try {
        await signInWithPopup(auth, provider);
    } catch (err) {
        console.error(err);
    }
}

export const userSignOut = () => {
    return auth.signOut();
}