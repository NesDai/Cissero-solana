import Link from "next/link"
import { SiteHeader } from "@/components/layout/site-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col bg-black overflow-hidden">
      {/* Green glow effects */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-[#22c55e]/20 blur-[150px] -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-[#22c55e]/10 blur-[150px] translate-y-1/3"></div>

      {/* Content container with max-width */}
      <div className="w-full max-w-[1200px] mx-auto flex flex-col flex-1">
        {/* Site header */}
        <SiteHeader />

        {/* Login content */}
        <div className="flex-1 flex items-center justify-center px-4">
          <Card className="w-full max-w-md bg-[#09090b]/80 border-[#27272a] backdrop-blur-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-semibold text-white text-center">Sign up to Cissero</CardTitle>
              <CardDescription className="text-[#a1a1aa] text-center">
                By signing up, you agree to our{" "}
                <Link href="#" className="text-white hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-white hover:underline">
                  Privacy Policy
                </Link>
                .
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full bg-white text-[#18181b] hover:bg-white/90" variant="outline">
                Continue with Google
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}