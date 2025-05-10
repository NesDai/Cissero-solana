// utils.ts
import {
    Connection,
    PublicKey,
    SystemProgram,
    Transaction,
    LAMPORTS_PER_SOL
} from "@solana/web3.js";
import {collection, deleteDoc, getDocs, updateDoc, where} from "firebase/firestore";
import {db} from "../../firebase";
import {doc, getDoc, setDoc} from "@firebase/firestore";
import {query} from "@firebase/database";

export async function sendTransactionWithWallet(
    connection: Connection,
    sender: PublicKey,
    receiver: PublicKey,
    amount: number,
    signTransaction: (tx: Transaction) => Promise<Transaction>
) {
    const transferInstruction = SystemProgram.transfer({
        fromPubkey: sender,
        toPubkey: receiver,
        lamports: amount * LAMPORTS_PER_SOL
    });

    const transaction = new Transaction().add(transferInstruction);
    transaction.feePayer = sender;
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    const signedTx = await signTransaction(transaction);

    const txid = await connection.sendRawTransaction(signedTx.serialize());

    const confirmation = await connection.getSignatureStatuses([txid],{"searchTransactionHistory": true});
    console.log(confirmation)
    if (confirmation?.value) {
        return [true, txid]
    }
    else {
        return [false, txid]
    }
}

// Solana transaction
export async function sendSOL(publicKey: PublicKey | null, receiverAddress: string, amount: number, connection: Connection, signTransaction: any) {
    if (!publicKey || !signTransaction) {
        console.error("Wallet not connected or signTransaction unavailable.");
        return null;
    }

    try {
        const receiver = new PublicKey(receiverAddress);
        const [status, txid] = await sendTransactionWithWallet(connection, publicKey, receiver, amount, signTransaction);
        if (status) {
            return txid
        }
        // console.log("Transaction Signature:", txid);
        // // return txid
    } catch (err) {
        console.error("Transaction failed:", err);
        return null
    }
}



// Fetch all data from a collection
export async function fetchData(name: string) {
    const querySnapshot = await getDocs(collection(db, name));
    const fetchedData = querySnapshot.docs.map(doc => doc.data());
    console.log(fetchedData);
    return fetchedData;
}

// Fetch one data from a collection
export async function fetchDataBy(name: string) {
    const dataDocRef = doc(db, "test", name);
    const dataDocSnap = await getDoc(dataDocRef);

    if (dataDocSnap.exists()) {
        return [dataDocSnap.data()].map((item, index) => ({
            id: dataDocSnap.id,
            ...item
        }));
    } else {
        return [];
    }
}

export async function fetchDataByQuery(name: number) {
    const q = query(collection(db, "test"), where("testID", "==", name));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}

export async function insertData(name: string) {
    try {
        const docRef = doc(db, "test", name);
        await setDoc(docRef, {
            name: "Abu",
            age: 99,
            finish: true,
            players: ["John", "Alice"],
        });

        return docRef.id;
    } catch (error) {
        console.error("Error adding document:", error);
        return null;
    }
}

// Function to update a single field by document ID
export async function updateField(documentId: string, fieldName: string, fieldValue: string) {
    try {
        const docRef = doc(db, "test", documentId); // "test" is your collection name
        await updateDoc(docRef, {
            [fieldName]: fieldValue, // Dynamically update the field
        });

        console.log("Document field updated successfully");
        return true; // Success flag
    } catch (error) {
        console.error("Error updating document field:", error);
        return false; // Failure flag
    }
}

// Function to delete a document by document ID
export async function deleteDocument(documentId: string) {
    try {
        const docRef = doc(db, "test", documentId); // "test" is your collection name
        await deleteDoc(docRef); // Deletes the entire document

        console.log("Document deleted successfully");
        return true; // Success flag
    } catch (error) {
        console.error("Error deleting document:", error);
        return false; // Failure flag
    }
}


