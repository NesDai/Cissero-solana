// utils.ts
import {
    Connection,
    PublicKey,
    SystemProgram,
    Transaction,
    LAMPORTS_PER_SOL
} from "@solana/web3.js";

export async function sendTransactionWithWallet(
    connection: Connection,
    sender: PublicKey,
    receiver: PublicKey,
    amount: number,
    signTransaction: (tx: Transaction) => Promise<Transaction>
): Promise<string> {
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
        alert("OK")
    }
    else {
        alert("FAILED")
    }

    return txid;
}

import {collection, getDocs} from "firebase/firestore";
import {db} from "../../firebase";

// Fetch all data from a collection
export async function fetchData(name: string) {
    const querySnapshot = await getDocs(collection(db, name));
    const fetchedData = querySnapshot.docs.map(doc => doc.data());
    console.log(fetchedData);
    return fetchedData;
}

// Fetch single data from a collection
export async function fetchDataById(collectionName: string, id: string) {
    const querySnapshot = await getDocs(collection(db, collectionName, id));
    const fetchedData = querySnapshot.docs.map(doc => doc.data());
    console.log(fetchedData);
    return fetchedData
}