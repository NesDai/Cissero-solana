"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/layout/site-header"

// Token package data
const tokenPackages = [
  { id: 1, amount: 100, price: 0.1 },
  { id: 2, amount: 200, price: 0.2 },
  { id: 3, amount: 500, price: 0.5 },
]

export default function BuyToken() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Green glow effects */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-[#22c55e]/20 blur-[150px] -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-[#22c55e]/10 blur-[150px] translate-y-1/3"></div>

      {/* Content container */}
      <div className="relative z-10 mx-auto max-w-[1200px]">
        <SiteHeader />

        <main className="px-4 py-16">
          <h1 className="text-3xl font-semibold text-center mb-16">Buy Tokens with SOL</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {tokenPackages.map((pkg) => (
              <Card key={pkg.id} className="w-full max-w-md bg-[#09090b]/80 border-[#27272a] backdrop-blur-sm">
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-semibold text-white text-left">{pkg.amount} Tokens</h2>
                  <p className="text-gray-400">{pkg.price} SOL</p>
                </CardContent>
                <CardFooter>
                  <Button className="bg-[#22c55e] text-black font-medium hover:bg-[#4ade80] transition-colors w-full">
                    Buy Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <p className="text-center text-gray-400 mt-8">
            Please ensure your wallet is connected to Solana mainnet before purchasing.
          </p>
        </main>
      </div>
    </div>
  )
}