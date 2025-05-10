'use client'

import { Button } from "@/components/ui/button";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {ConnectionContextState, useConnection, useWallet} from "@solana/wallet-adapter-react";
import {Connection, PublicKey, Transaction} from "@solana/web3.js";
import { sendTransactionWithWallet } from "@/app/utils";

export default function TestTransaction() {
    const { connection } = useConnection();
    const { publicKey, signTransaction } = useWallet();

    const receiverAddress = "4cSqP6knoLyLbwNKuJNogqmA1nXg7vFsQTNmYSbCWbQn"; // <- receiver key string

    // async function sendSOL(publicKey: PublicKey, receiverAddress: string, amount: number, connection: Connection, signTransaction: any) {
    //     if (!publicKey || !signTransaction) {
    //         console.error("Wallet not connected or signTransaction unavailable.");
    //         return;
    //     }
    //
    //     try {
    //         const receiver = new PublicKey(receiverAddress);
    //         const txid = await sendTransactionWithWallet(connection, publicKey, receiver, amount, signTransaction);
    //         console.log("Transaction Signature:", txid);
    //     } catch (err) {
    //         console.error("Transaction failed:", err);
    //     }
    // }

    return (
        <div>
            {/*<Button onClick={test} className="cursor-pointer">Click me</Button>*/}
            {/*<div className="border hover:border-slate-900 rounded mt-4">*/}
            {/*    <WalletMultiButton />*/}
            {/*</div>*/}
        </div>
    );
}
