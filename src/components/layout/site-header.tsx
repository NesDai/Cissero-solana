"use client"

import Link from "next/link"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { useWallet } from "@solana/wallet-adapter-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { UserAuth } from "@/contexts/authContext"
import { userSignOut } from "@/lib/firebase/auth"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from 'lucide-react'

// Dynamically import the Solana wallet button to avoid SSR issues
const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
)

export function SiteHeader() {
  const { user } = UserAuth()
  const { publicKey } = useWallet()
  const router = useRouter()

  // Sign out handler
  const handleSignOut = async () => {
    try {
      await userSignOut()
      router.push('/')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <header className="w-full py-4">
      <div className="flex items-center justify-between px-4 sm:px-6 max-w-[1200px] mx-auto">
        <Link href="/" className="text-white text-xl font-medium">
          Cissero
        </Link>
        <nav className="flex items-center gap-6">

          {/* Connect to Phantom (only for signed-in users) */}
          {user && (
            <WalletMultiButtonDynamic className="w-36 flex items-center justify-center text-white border hover:bg-white/10 py-1 rounded-md">
              <Image src="/phantom-logo.svg" alt="Phantom logo" width={20} height={20} className="mr-2" />
              <span className="text-sm text-center truncate">
                {publicKey ? 'Connected' : 'Connect to Phantom'}
              </span>
            </WalletMultiButtonDynamic>
          )}

          {/* Always visible links */}
          <Link href="/" className="text-white text-sm font-bold hover:text-muted-foreground transition-colors">
            Home
          </Link>
          <Link href="/matches" className="text-white text-sm font-bold hover:text-muted-foreground transition-colors">
            Matches
          </Link>

          {/* Auth actions */}
          {!user ? (
            <>
              <Link href="/login" className="text-white text-sm font-bold hover:text-muted-foreground transition-colors">
                Log In
              </Link>
              <Button
                size="sm"
                variant="secondary"
                className="bg-white text-black hover:bg-white/90 rounded-md"
                onClick={() => router.push('/signup')}
              >
                Sign Up
              </Button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex items-center bg-[#09090b]/80 text-white hover:text-muted-foreground transition-colors px-3 py-1">
                  <span>{user.displayName || user.email}</span>
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 bg-[#09090b]/80 border-[#27272a] p-1 shadow-lg rounded-md"
              >
                <DropdownMenuLabel className="text-white">Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center px-3 py-2 rounded-md text-white hover:bg-accent hover:text-black">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut} className="px-3 py-2 rounded-md text-white hover:bg-accent hover:text-black">
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>
      </div>
    </header>
  )
}