import { Suspense } from "react"
import SucessoClient from "./SucessoClient"

export const dynamic = "force-dynamic"

export default function SucessoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">A carregar...</div>}>
      <SucessoClient />
    </Suspense>
  )
}