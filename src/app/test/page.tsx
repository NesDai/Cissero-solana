'use client'

import { Button } from "@/components/ui/button"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { useEffect, useState } from "react"
import {Connection, LAMPORTS_PER_SOL, PublicKey} from "@solana/web3.js"
import {deleteDocument, fetchData, fetchDataBy, fetchDataByQuery, insertData, sendSOL, updateField} from "@/app/utils"
import { loginWithGoogle, userSignOut } from "@/lib/firebase/auth"
import { UserAuth } from "@/contexts/authContext"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";

export default function Test() {
    const [balance, setBalance] = useState(0)
    // const [loading, setLoading] = useState(true);
    const [firebaseData, setFirebaseData] = useState({})
    const [text, setText] = useState("")
    const [text2, setText2] = useState("")
    const [text3, setText3] = useState("")
    const [text4, setText4] = useState("")
    const [receiverAddress, setReceiverAddress] = useState("4cSqP6knoLyLbwNKuJNogqmA1nXg7vFsQTNmYSbCWbQn")
    const [amount, setAmount] = useState(0)
    const [result, setResult] = useState("-")
    const [refresh, setRefresh] = useState(false)

    // for solana
    const { connection } = useConnection();
    const { publicKey, signTransaction } = useWallet();

    // for auth to access user and userdata
    // user is metadata of user
    // userdata is data from firebase
    const { user } = UserAuth();

    // // this is to suspend when user change for ui changes
    // useEffect(() => {
    //     const checkAuthentication = async () => {
    //         await new Promise((resolve) => setTimeout(resolve, 50));
    //         setLoading(false);
    //     };
    //     checkAuthentication();
    // }, [user]);

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
        setRefresh(false)
    }, [connection, publicKey, refresh])

    async function handleFetchData(filter = false, query = false) {
        if (!filter && !query) {
            const data = await fetchData("test")
            setFirebaseData(data)
        }
        else {
            const data = await fetchDataBy("1")
            setFirebaseData(data)
        }

        if (query) {
            const data = await fetchDataByQuery(1)
            setFirebaseData(data)
        }
    }

    async function handleInsertData(name: string) {
        await insertData(name)
    }

    function handleTextChange(event: React.ChangeEvent<HTMLInputElement>) {
        setText(event.target.value)
    }

    function handleText2Change(event: React.ChangeEvent<HTMLInputElement>) {
        setText2(event.target.value)
    }

    function handleText3Change(event: React.ChangeEvent<HTMLInputElement>) {
        setText3(event.target.value)
    }

    async function handleUpdateData(docId: string, field: string, value: string) {
        await updateField(docId, field, value)
    }

    function handleText4Change(event: React.ChangeEvent<HTMLInputElement>) {
        setText4(event.target.value)
    }

    async function handleTransaction() {
        console.log("HELLO")
        const res = await sendSOL(publicKey, receiverAddress, amount, connection, signTransaction)
        if (res) {
            setResult("Transaction Signature " + res)
            setRefresh(true)
        }
        else {
            setResult("TRANSACTION FAILED")
        }
    }

    return (
        <div className="px-6">
            <p className="text-2xl py-6">Testing Page</p>
            <Card>
                <CardHeader>
                    <CardTitle>Solana Wallet Adapter</CardTitle>
                    <CardDescription>Test wallet connection</CardDescription>
                </CardHeader>
                <CardContent>
                    <WalletMultiButton>
                        <p className="text-sm">
                            {publicKey ? "Connected" : "Connect Wallet"}
                        </p>
                    </WalletMultiButton>
                </CardContent>
                <CardFooter>
                    {publicKey &&
                        <div className="flex flex-col">
                            <p>Balance: {balance} SOL</p>
                            <p>Public Key: {publicKey ? publicKey?.toBase58() : "null"}</p>
                        </div>
                    }
                </CardFooter>
            </Card>

            <br></br>

            <Card>
                <CardHeader>
                    <CardTitle>Solana Wallet Adapter</CardTitle>
                    <CardDescription>Test wallet transaction</CardDescription>
                </CardHeader>
                <CardContent>
                    {publicKey ?
                        <div className="flex flex-col gap-1">
                            <CardDescription>Sample Address 4cSqP6knoLyLbwNKuJNogqmA1nXg7vFsQTNmYSbCWbQn</CardDescription>
                            <div className="flex flex-row gap-2">
                                <Input
                                    type="text"
                                    placeholder="Amount"
                                    onChange={(event) => {setAmount(Number(event.target.value))}}
                                    className="w-[100px]"
                                />
                                <Input
                                    type="text"
                                    placeholder="Public Key"
                                    value={receiverAddress}
                                    onChange={(event) => {setReceiverAddress(event.target.value)}}
                                    className="w-[500px]"
                                />
                                <Button
                                    onClick={handleTransaction}
                                    className="cursor-pointer"
                                >
                                    Send Money
                                </Button>
                            </div>
                        </div>
                        :
                        <div>
                            Please Connect Your Wallet
                        </div>
                    }
                </CardContent>
                <CardFooter>
                    {publicKey &&
                        <div className="flex flex-col">
                            <p>Balance: {balance} SOL</p>
                            <p>Public Key: {publicKey ? publicKey?.toBase58() : "null"}</p>
                            <p>Result: {result}</p>
                        </div>
                    }
                </CardFooter>
            </Card>

            <br></br>

            <Card>
                <CardHeader>
                    <CardTitle>Firebase</CardTitle>
                    <CardDescription>Authentication</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button
                        onClick={loginWithGoogle}
                        disabled={user}
                        className="cursor-pointer mr-2"
                    >
                        sign in
                    </Button>
                    <Button
                        onClick={userSignOut}
                        disabled={!user}
                        className="cursor-pointer"
                    >
                        sign out
                    </Button>
                </CardContent>
                <CardFooter>
                    <div className="flex flex-col">
                        <p className="pb-3 text-xl">
                            Status: <b>{user ? "Logged In" : "Not Logged In"}</b>
                        </p>
                        <p>
                            User ID: <b>{user?.uid ?? "null"}</b>
                        </p>
                        <p>
                            Email: <b>{user?.email ?? "null"}</b>
                        </p>
                    </div>
                </CardFooter>
            </Card>

            <br></br>

            <Card>
                <CardHeader>
                    <CardTitle>Firebase</CardTitle>
                    <CardDescription>CRUD Operation</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-1">
                        <div className="flex flex-row gap-1">
                            <Button
                                onClick={() => {handleFetchData(false)}}
                            >
                                Fetch All
                            </Button>
                            <Button
                                onClick={() => {handleFetchData(true)}}
                            >
                                Fetch By Document ID
                            </Button>
                            <Button
                                onClick={() => {handleFetchData(false,true)}}
                            >
                                Fetch By Query
                            </Button>
                        </div>
                        <div className="flex flex-row gap-1 items-center">
                            <Button
                                onClick={() => {handleInsertData(text)}}
                            >
                                Insert
                            </Button>
                            Doc ID
                            <Input type="text" placeholder="Doc ID" onChange={handleTextChange} className="w-[100px]"/>
                        </div>
                        <div className="flex flex-row gap-1 items-center">
                            <Button
                                onClick={() => {handleUpdateData(text2, "hello", text3)}}
                            >
                                Update
                            </Button>
                            Doc ID
                            <Input type="text" placeholder="Doc ID" onChange={handleText2Change} className="w-[100px]"/>
                            Hello Field
                            <Input type="text" placeholder="Value" onChange={handleText3Change} className="w-[100px]"/>
                        </div>

                        <div className="flex flex-row gap-1 items-center">
                            <Button
                                onClick={async () => {
                                    await deleteDocument(text4)
                                }}
                            >
                                Delete
                            </Button>
                            Doc ID
                            <Input type="text" placeholder="Doc ID" onChange={handleText4Change} className="w-[100px]"/>
                        </div>

                    </div>
                </CardContent>
                <CardFooter>
                    <div className="flex flex-col">
                        <p>{JSON.stringify(firebaseData, null, 2)}</p>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
