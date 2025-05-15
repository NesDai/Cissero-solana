"use client"

import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="w-full py-6 text-center text-sm text-gray-400">
      <p>© {new Date().getFullYear()} Monash Miners. All rights reserved.</p>
      <div className="flex justify-center space-x-6 mt-2">
        <Link href="" className="hover:underline">
          Terms of Service
        </Link>
        <Link href="" className="hover:underline">
          Privacy Policy
        </Link>
        <Link href="" className="hover:underline">
          Regulatory Compliance
        </Link>
      </div>
    </footer>
  )
}
