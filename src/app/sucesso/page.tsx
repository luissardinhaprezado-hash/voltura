import { Suspense } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Link from "next/link"
import SucessoClient from "./SucessoClient"

export const dynamic = "force-dynamic"

export default function SucessoPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4">
        <Suspense fallback={<div className="text-center">A carregar...</div>}>
          <SucessoClient />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}