'use client'

import { Button } from "@/components/ui/button"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { useEffect, useState } from "react"
import { LAMPORTS_PER_SOL } from "@solana/web3.js"
import { fetchDataById } from "@/app/utils"
import { loginWithGoogle, userSignOut } from "@/lib/firebase/auth"
import { UserAuth } from "@/contexts/authContext"

export default function Test() {
    const [balance, setBalance] = useState(0)
    const [loading, setLoading] = useState(true);
    const { connection } = useConnection()
    const { publicKey } = useWallet()

    // for auth to access user and userdata
    // user is metadata of user
    // userdata is data from firebase
    const { user, userData } = UserAuth();

    // this is to suspend when user change for ui changes
    useEffect(() => {
        const checkAuthentication = async () => {
            await new Promise((resolve) => setTimeout(resolve, 50));
            setLoading(false);
        };
        checkAuthentication();
    }, [user]);

    console.log(userData)
    console.log(user)

    useEffect(() => {
        const fetchBalance = async () => {
            if (connection && publicKey) {
                try {
                    const accountInfo = await connection.getAccountInfo(publicKey)
                    if (accountInfo) {
                        setBalance(accountInfo.lamports / LAMPORTS_PER_SOL)
                    } else {
                        setBalance(0)
                    }
                } catch (error) {
                    console.error("Error fetching balance:", error)
                }
            }
        }

        fetchBalance()
    }, [connection, publicKey])


    return (
        <div>
            <p>Solana testing will be done here</p>

            Shadcn testing
            <Button>Click me</Button>
            <div className="border hover:border-slate-900 rounded">
                <WalletMultiButton>
                    <p className="text-sm">
                        {publicKey ? "Connected" : "Connect Wallet"}
                    </p>
                </WalletMultiButton>
            </div>

            Your current balance {balance}

            <br></br>

            <Button onClick={() => fetchDataById("test", "testing").then(console.log)}>
                TEST FIREBASE
            </Button>

            <br></br>
            <Button
                onClick={loginWithGoogle}
                disabled={user}
            >
                sign in
            </Button>
            <Button
                onClick={userSignOut}
                disabled={!user}
            >
                sign out
            </Button>
            <br />
            {!loading && (
                <>
                    {user?.uid ?? "not logged in"}
                    <br />
                    {user?.email ?? "not logged in"}
                </>
            )}
        </div>
    )
}
