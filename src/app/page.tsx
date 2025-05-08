"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SiteHeader } from "@/components/layout/site-header"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d0d0d] to-[#0d0d0d] relative overflow-hidden">
      {/* Green glow effects */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-[#22c55e]/20 blur-[150px] -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-[#22c55e]/10 blur-[150px] translate-y-1/3"></div>

      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <SiteHeader />

        {/* Hero Section */}
        <section className="px-4 sm:px-6 py-24">
          <div className="max-w-2xl">
            <h1 className="text-white text-5xl font-bold leading-tight">
              Call the winner.
              <br />
              Champion your gamers.
            </h1>
            <p className="text-muted-foreground mt-6 text-lg">
              Use SOL-based in-app tokens to support your favourite gaming steamers as they compete live. Predict match outcomes,
              support your favourite team, and win rewards.
            </p>
            <div className="flex gap-4 mt-8">
              <Button className="bg-primary hover:bg-primary/90 text-white px-6" onClick={() => {}}>
                Get Started
              </Button>
              <Button variant="outline" className="bg-white text-black hover:bg-white/90 rounded-md" onClick={() => {}}>
                Learn More
              </Button>
            </div>
          </div>
        </section>

        {/* Supported Platforms */}
        <section className="px-4 sm:px-6 py-24 text-center">
          <h2 className="text-white text-3xl font-bold mb-4">Supported Platforms & Games</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
            Forecast match results for today's top trending games.
          </p>
          <div className="flex justify-center gap-12 mt-8">
            <div className="text-white opacity-80 hover:opacity-100 transition-opacity cursor-pointer">Twitch</div>
            <div className="text-white opacity-80 hover:opacity-100 transition-opacity cursor-pointer">YouTube</div>
            <div className="text-white opacity-80 hover:opacity-100 transition-opacity cursor-pointer">Valorant</div>
            <div className="text-white opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
              League of Legends
            </div>
          </div>
        </section>

        {/* How to Win */}
        <section className="px-4 sm:px-6 py-24 text-center">
          <h2 className="text-white text-3xl font-bold mb-16">How to Win:</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border border-[#1e1e1e] bg-[#0d0d0d]/50 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="text-xl font-medium text-white mb-4">1. Pick a match</div>
                <p className="text-muted-foreground">
                  Browse live or upcoming matches between your favorite gaming streamers and choose who you think will win.
                </p>
              </CardContent>
            </Card>
            <Card className="border border-[#1e1e1e] bg-[#0d0d0d]/50 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="text-xl font-medium text-white mb-4">2. Make your prediction</div>
                <p className="text-muted-foreground">
                  Use your tokens to support your chosen streamers. The bigger the pool, the bigger the rewards!
                </p>
              </CardContent>
            </Card>
            <Card className="border border-[#1e1e1e] bg-[#0d0d0d]/50 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="text-xl font-medium text-white mb-4">3. Claim rewards</div>
                <p className="text-muted-foreground">
                  If your prediction is correct, you win a share of the prize pool. More wins = more tokens!
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Coming Soon */}
        <section className="px-4 sm:px-6 py-24 text-center">
          <h2 className="text-white text-3xl font-bold mb-4">Coming Soon</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            More features are on the way. Stay tuned for updates.
          </p>
        </section>
      </div>
    </div>
  )
}