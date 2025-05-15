"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { SiteHeader } from "@/components/layout/site-header"

export default function Match() {
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null)
  const [betAmount, setBetAmount] = useState<string>("")
  const [isFormValid, setIsFormValid] = useState<boolean>(false)

  // Dummy data
  const matchTitle = "Championship Finals: Team Alpha vs Team Omega"
  const player1 = "toasted"
  const player2 = "xcocobar"
  const balance = 10.0

  // Dummy betting distribution data
  const bettingDistribution = {
    player1Percentage: 65,
    player2Percentage: 35,
    totalAmount: 245.75,
  }

  // Dummy chat messages
  const chatMessages = [
    { id: 1, user: "User A", time: "2m ago", message: "Great match!" },
    { id: 2, user: "User B", time: "5m ago", message: "Team Alpha is looking strong today!" },
    { id: 3, user: "User C", time: "7m ago", message: "I think Team Omega will make a comeback." },
    { id: 4, user: "User D", time: "10m ago", message: "The last round was incredible!" },
    { id: 5, user: "User E", time: "12m ago", message: "Who's behind Team Alpha?" },
  ]

  // Dummy analyst messages
  const analystMessages = [
    { id: 1, user: "Analyst X", time: "18m ago", message: "This is not financial advice." },
    {
      id: 2,
      user: "Analyst Y",
      time: "6m ago",
      message: "Team Omega's strategy seems to be focused on controlling the centre.",
    },
    {
      id: 3,
      user: "Analyst Z",
      time: "2m ago",
      message: "Historical matches show that Team Alpha performs better in the second half.",
    },
  ]

  // Validate form
  const validateForm = (player: string | null, amount: string) => {
    const isValid = player !== null && amount !== "" && Number.parseFloat(amount) > 0
    setIsFormValid(isValid)
    return isValid
  }

  const handlePlayerSelect = (player: string) => {
    setSelectedPlayer(player)
    validateForm(player, betAmount)
  }

  const handleBetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = e.target.value
    setBetAmount(amount)
    validateForm(selectedPlayer, amount)
  }

  const handleSubmitBet = () => {
    if (isFormValid) {
      // Reset form without alert
      setSelectedPlayer(null)
      setBetAmount("")
      setIsFormValid(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Green glow effects - fixed position to cover entire scrollable area */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] rounded-full bg-[#22c55e]/20 blur-[150px] -translate-y-1/2 z-0"></div>
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-[#22c55e]/10 blur-[150px] translate-y-1/3 z-0"></div>

      {/* Content container */}
      <div className="relative z-10 mx-auto max-w-[1200px]">
        <SiteHeader />

        {/* Main content with added padding at the top */}
        <main className="px-4 py-12">
          <h2 className="mb-6 text-3xl font-semibold text-white">{matchTitle}</h2>

          <div className="grid grid-cols-3 gap-6">
            {/* Stream Section - Takes up 2/3 of the width */}
            <div className="col-span-2 flex flex-col">
              <div className="aspect-video rounded border border-[#22c55e] bg-black/50 overflow-hidden">
                <div className="flex h-full flex-col items-center justify-center p-6">
                  <Skeleton className="h-6 w-32 mb-4 bg-[#374151]" />
                  <Skeleton className="h-4 w-48 mb-8 bg-[#374151]" />
                  <Skeleton className="h-40 w-full mb-4 bg-[#374151]" />
                  <p className="text-[#9ca3af] text-sm mt-4">Loading stream...</p>
                </div>
              </div>
            </div>

            {/* Chat Section - Takes up 1/3 of the width */}
            <div className="col-span-1">
              <Tabs defaultValue="chat" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="chat" className="data-[state=active]:bg-white data-[state=active]:text-black">
                    Chat
                  </TabsTrigger>
                  <TabsTrigger
                    value="analyst"
                    className="data-[state=active]:bg-[#22c55e] data-[state=active]:text-white"
                  >
                    Analyst
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="chat" className="rounded-b border border-[#374151] bg-black/50">
                  <div className="h-[300px] overflow-y-auto p-4">
                    {chatMessages.map((msg) => (
                      <div key={msg.id} className="mb-4 flex items-start gap-3">
                        <div className="shrink-0 h-8 w-8 rounded-full bg-[#374151]"></div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{msg.user}</span>
                            <span className="text-xs text-[#9ca3af]">{msg.time}</span>
                          </div>
                          <p className="text-sm text-[#d1d5db]">{msg.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-[#374151] p-2">
                    <Input
                      placeholder="Type a message..."
                      className="bg-[#374151] border-none text-white placeholder:text-[#9ca3af]"
                    />
                  </div>
                </TabsContent>
                <TabsContent value="analyst" className="rounded-b border border-[#374151] bg-black/50">
                  <div className="h-[300px] overflow-y-auto p-4">
                    {analystMessages.map((msg) => (
                      <div key={msg.id} className="mb-4 flex items-start gap-3">
                        <div className="shrink-0 h-8 w-8 rounded-full bg-[#166534]"></div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{msg.user}</span>
                            <span className="text-xs text-[#9ca3af]">{msg.time}</span>
                          </div>
                          <p className="text-sm text-[#d1d5db]">{msg.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-[#374151] p-2">
                    <Input
                      placeholder="Type a message..."
                      className="bg-[#374151] border-none text-white placeholder:text-[#9ca3af]"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Betting and Ad sections in a new row with aligned heights */}
            <div className="col-span-2 rounded border border-[#374151] bg-black/50 p-6">
              <h2 className="mb-4 text-xl font-bold">Predict the Outcome</h2>
                {/* Betting distribution progress bar */}
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-[#22c55e] mr-2"></div>
                      <span className="text-sm font-medium">
                        {player1}: {bettingDistribution.player1Percentage}%
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium">
                        {player2}: {bettingDistribution.player2Percentage}%
                      </span>
                      <div className="w-3 h-3 rounded-full bg-[#9ca3af] ml-2"></div>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-[#374151] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#22c55e] rounded-full"
                      style={{ width: `${bettingDistribution.player1Percentage}%` }}
                    ></div>
                  </div>
                  <div className="mt-1 text-xs text-[#9ca3af] text-right">
                    Total Pool: {bettingDistribution.totalAmount.toFixed(2)} token
                  </div>
                </div>
              <div className="mb-4 grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className={`border-[#22c55e] text-black hover:bg-[#166534] ${selectedPlayer === player1 ? "bg-[#166534]" : ""}`}
                  onClick={() => handlePlayerSelect(player1)}
                >
                  {player1}
                </Button>
                <Button
                  variant="outline"
                  className={`border-[#22c55e] text-black hover:bg-[#166534] ${selectedPlayer === player2 ? "bg-[#166534]" : ""}`}
                  onClick={() => handlePlayerSelect(player2)}
                >
                  {player2}
                </Button>
              </div>
              <div className="mb-4">
              <Input
  type="text"
  inputMode="decimal"
  pattern="[0-9]*"
  value={betAmount}
  onChange={handleBetAmountChange}
  className="bg-[#374151] border-none text-white"
/>

              </div>
              <p className="mb-4 text-sm text-[#9ca3af]">Balance: {balance.toFixed(2)} token</p>
              <Button
                className={`w-full ${isFormValid ? "bg-[#22c55e] hover:bg-[#166534]" : "bg-[#374151] cursor-not-allowed"} text-white`}
                disabled={!isFormValid}
                onClick={handleSubmitBet}
              >
                Submit to Trade
              </Button>
            </div>

            {/* Ad Section - Takes up 1/3 of the width, with height matching betting section */}
            <div className="col-span-1 flex items-center justify-center rounded bg-[#d9f99d] text-black h-full">
              <div className="font-bold text-center">Brought to you by: We love Monash Miners😉</div>
            </div>
          </div>
        </main>
        <div className="pb-12"></div>
      </div>
    </div>
  )
}