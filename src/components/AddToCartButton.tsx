"use client"

import { useState } from "react"
import { useCart } from "@/context/CartContext"

type Props = {
  product: {
    id: string
    name: string
    price: number
    image: string
    slug: string
  }
}

export default function AddToCartButton({ product }: Props) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  function handleAdd() {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <button
      onClick={handleAdd}
      className={`w-full sm:w-auto font-semibold px-10 py-3.5 rounded-full transition ${
        added
          ? "bg-green-600 text-white"
          : "bg-emerald-600 hover:bg-emerald-500 text-white"
      }`}
    >
      {added ? "✓ Adicionado ao Carrinho" : "Adicionar ao Carrinho"}
    </button>
  )
}