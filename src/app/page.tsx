"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BaseLayout } from "@/components/layout/base-layout"
import { Twitch, Youtube, Gamepad, ShieldCheck } from 'lucide-react'

const platforms = [
  { icon: Twitch, label: 'Twitch' },
  { icon: Youtube, label: 'YouTube' },
  { icon: Gamepad, label: 'Valorant' },
  { icon: ShieldCheck, label: 'League of Legends' },
]

const steps = [
  { title: 'Pick a match', desc: 'Browse live or upcoming matches and choose who you think will win.' },
  { title: 'Make a prediction', desc: 'Stake your SOL in the prediction pool: bigger pools mean bigger rewards!' },
  { title: 'Claim rewards', desc: 'If your prediction is correct, you take home your share of the prize pool.' },
]

export default function Home() {
  return (
    <BaseLayout>
      {/* Hero Section */}
      <section className="px-4 sm:px-6 py-20 text-center lg:text-left">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-5xl font-bold mb-4 text-white">
            Call the <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#40E0D0] to-[#B19CD9]">winner</span>
            <br />
            Champion your gamers
          </h1>
          <p className="text-muted-foreground mb-6">
            Trade SOL to support your favourite gaming streamers as they compete live.
            Predict match outcomes, support your favourite team, and win rewards.
          </p>
          <div className="flex justify-center lg:justify-start gap-4">
            <Link href="/signup" passHref>
              <Button className="bg-[#09090b]/80 text-white hover:transition-colors px-6 py-2 rounded-md">
                Get Started
              </Button>
            </Link>
            <Link href="/check-base-layout" passHref>
              <Button className="bg-white text-black hover:bg-white/90 px-6 py-2 rounded-md">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Supported Platforms & Games */}
      <section className="px-4 sm:px-6 py-12 text-center">
        <h2 className="text-2xl font-bold text-white mb-6">Supported Platforms and Games</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-md mx-auto">
          {platforms.map(({ icon: Icon, label }, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <Icon size={32} className="text-[#118C4F] mb-2" />
              <span className="text-white text-sm">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How to Win */}
      <section className="px-4 sm:px-6 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-8">How to Win</h2>
        <div className="flex flex-col md:flex-row justify-center gap-6">
          {steps.map(({ title, desc }, idx) => (
            <Card key={idx} className="p-6 flex-1 bg-[#09090b]/80 border-[#27272a]">
              <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
              <p className="text-muted-foreground">{desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Coming Soon */}
      <section className="px-4 sm:px-6 py-16 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Coming Soon</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          We're cooking up even more ways to make your predictions matter. Stay tuned!
        </p>
      </section>
    </BaseLayout>
  )
}