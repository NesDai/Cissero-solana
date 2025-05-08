"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export function SiteHeader() {
  return (
    <header className="w-full py-4 sticky top-0">
      <div className="flex items-center justify-between px-4 sm:px-6">
        <span className="text-white text-xl font-medium cursor-pointer">Cissero</span>
        <nav className="flex items-center gap-6">
        <Link
            href="/"
            className="text-white text-sm hover:text-primary transition-colors"
          >
            Home
          </Link>
          <Link
            href="/buy-token"
            className="text-white text-sm hover:text-primary transition-colors"
          >
            Buy Tokens
          </Link>
          <Link
            href="/matches"
            className="text-white text-sm hover:text-primary transition-colors"
          >
            Matches
          </Link>
          <Link
            href="/login"
            className="text-white text-sm hover:text-primary transition-colors"
          >
            Login
          </Link>
          <Button
            size="sm"
            variant="secondary"
            className="bg-white text-black hover:bg-white/90 rounded-md"
            onClick={() => {}}
          >
            Sign Up
          </Button>
        </nav>
      </div>
    </header>
  )
}
