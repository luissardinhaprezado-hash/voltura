~"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { useCart } from "@/context/CartContext"

export default function SucessoClient() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get("order")
  const { clearCart } = useCart()

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <div className="text-center max-w-md">
      <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
        OK
      </div>

      <h1 className="text-3xl font-bold mb-3">Pagamento confirmado!</h1>

      <p className="text-gray-600 mb-2">
        Obrigado pela tua compra.
      </p>

      {orderNumber && (
        <p className="text-gray-500 text-sm mb-6">
          Numero da encomenda: <strong className="text-gray-800">{orderNumber}</strong>
        </p>
      )}

      <p className="text-gray-600 mb-8">
        Vais receber um email de confirmacao em breve.<br />
        Podes acompanhar o estado da encomenda a qualquer momento.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/rastreio"
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-3 rounded-full transition"
        >
          Rastrear Encomenda
        </Link>
        <Link
          href="/"
          className="border border-gray-300 hover:border-emerald-500 text-gray-700 font-semibold px-6 py-3 rounded-full transition"
        >
          Continuar a comprar
        </Link>
      </div>
    </div>
  )
}