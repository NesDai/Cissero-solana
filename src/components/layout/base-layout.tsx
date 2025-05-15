"use client"

import { ReactNode } from "react"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"

interface BaseLayoutProps {
  children: ReactNode
}

export function BaseLayout({ children }: BaseLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d0d0d] to-[#0d0d0d] relative overflow-hidden">
      {/* Green glow effects */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-[#22c55e]/20 blur-[150px] -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-[#22c55e]/10 blur-[150px] translate-y-1/3" />

      <div className="max-w-[1200px] mx-auto">
        {/* Header (non-sticky by default) */}
        <div className="w-full py-4">
          <SiteHeader />
        </div>

        {/* Main page content */}
        <main className="pt-8 pb-16">
          {children}
        </main>

        {/* Footer (non-sticky by default) */}
        <div className="w-full py-4">
          <SiteFooter />
        </div>
      </div>
    </div>
  )
}