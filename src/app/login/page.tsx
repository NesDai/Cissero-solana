"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BaseLayout } from "@/components/layout/base-layout"
import { loginWithGoogle } from "@/lib/firebase/auth"

export default function LoginPage() {
  const router = useRouter()

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle()
      router.push('/matches')
    } catch (error) {
      console.error('Google sign-in error:', error)
    }
  }

  return (
    <BaseLayout>
      {/* Centered signup card */}
      <section className="flex items-center justify-center min-h-[calc(100vh-144px)] px-4">
        <Card className="w-full max-w-md bg-[#09090b]/80 border-[#27272a] backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold text-white text-left">
              Welcome back
            </CardTitle>
            <CardDescription className="text-[#a1a1aa] text-left">
              Log in to continue.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center space-x-2 bg-white text-black hover:bg-white/90 px-4 py-2 rounded-md"
            >
              <Image
                src="/google-logo.svg"
                alt="Google logo"
                width={20}
                height={20}
                className="inline-block"
              />
              <span>Continue with Google</span>
            </Button>
          </CardContent>
        </Card>
      </section>
    </BaseLayout>
  )
}