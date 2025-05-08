'use client'

import { Button } from "@/components/ui/button"
import {WalletMultiButton} from "@solana/wallet-adapter-react-ui";
import {useConnection, useWallet} from "@solana/wallet-adapter-react";
import {useEffect, useState} from "react";
import {LAMPORTS_PER_SOL} from "@solana/web3.js";

export default function Testui() {

    return (
        <>
            <div className="h-[100] bg-black">
                hi
            </div>
            <div className="flex">
                <div className="w-[1200px] mx-auto bg-gray-100 p-4">
                    <p className="text-xl">Title</p>
                    <p className="text-base">Hello this is subtitle</p>
                </div>
            </div>
        </>
    );
}
