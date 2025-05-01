'use client'

import { Button } from "@/components/ui/button"
import {WalletMultiButton} from "@solana/wallet-adapter-react-ui";
import {useConnection, useWallet} from "@solana/wallet-adapter-react";
import {useEffect, useState} from "react";
import {LAMPORTS_PER_SOL} from "@solana/web3.js";
import {fetchData, fetchDataById} from "@/app/utils";

export default function Test() {
    const [balance, setBalance] = useState(0);
    const { connection } = useConnection();
    const { publicKey } = useWallet();

    useEffect(() => {
        const fetchBalance = async () => {
            if (connection && publicKey) {
                try {
                    const accountInfo = await connection.getAccountInfo(publicKey);
                    if (accountInfo) {
                        // Account info
                        console.log(publicKey);
                        console.log(accountInfo);
                        setBalance(accountInfo.lamports / LAMPORTS_PER_SOL);
                    } else {
                        setBalance(0);
                    }
                } catch (error) {
                    console.error("Error fetching balance:", error);
                }
            }
        };

        fetchBalance();
    }, [connection, publicKey]);

    return (
        <div>
            <p>
                Solana testing will be done here
            </p>

            Shadcn testing
            <Button>Click me</Button>
            <div className="border hover:border-slate-900 rounded">
                <WalletMultiButton style={{}} />
            </div>
            Your current {balance}

            <Button onClick={() => {fetchDataById("test", "testing").then(r => console.log(r))}}>TEST FIREBASE</Button>
        </div>

    );
}
