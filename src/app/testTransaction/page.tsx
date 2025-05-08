'use client'

import { Button } from "@/components/ui/button";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { sendTransactionWithWallet } from "@/app/utils";

export default function TestTransaction() {
    const { connection } = useConnection();
    const { publicKey, signTransaction } = useWallet();

    const receiverAddress = "4cSqP6knoLyLbwNKuJNogqmA1nXg7vFsQTNmYSbCWbQn"; // <- receiver key string

    async function test() {
        if (!publicKey || !signTransaction) {
            console.error("Wallet not connected or signTransaction unavailable.");
            return;
        }

        try {
            const receiver = new PublicKey(receiverAddress);
            const txid = await sendTransactionWithWallet(connection, publicKey, receiver, 0.0001, signTransaction);
            console.log("Transaction Signature:", txid);
        } catch (err) {
            console.error("Transaction failed:", err);
        }
    }

    return (
        <div>
            <Button onClick={test} className="cursor-pointer">Click me</Button>
            <div className="border hover:border-slate-900 rounded mt-4">
                <WalletMultiButton />
            </div>
        </div>
    );
}
