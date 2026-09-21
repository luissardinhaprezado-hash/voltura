"use client"

import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { useCart } from "@/context/CartContext"
import Link from "next/link"
import Image from "next/image"

export default function CarrinhoPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-2xl font-bold mb-2">O teu carrinho está vazio</h1>
            <p className="text-gray-500 mb-6">Adiciona produtos para continuar</p>
            <Link
              href="/produtos"
              className="inline-block bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-8 py-3 rounded-full transition"
            >
              Ver Produtos
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 py-10 w-full">
        <h1 className="text-3xl font-bold mb-8">
          Carrinho ({totalItems} {totalItems === 1 ? "item" : "itens"})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de produtos */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 border flex gap-4 items-center"
              >
                <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      Sem imagem
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <Link
                    href={`/produtos/${item.slug}`}
                    className="font-semibold hover:text-emerald-600 line-clamp-2"
                  >
                    {item.name}
                  </Link>
                  <p className="text-emerald-600 font-bold mt-1">
                    {item.price.toFixed(2)} €
                  </p>

                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold">
                    {(item.price * item.quantity).toFixed(2)} €
                  </p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-sm text-red-500 hover:underline mt-2"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Resumo */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border sticky top-24">
              <h2 className="font-bold text-lg mb-4">Resumo</h2>

              <div className="space-y-2 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span>{totalPrice.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Envio</span>
                  <span>Calculado no checkout</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{totalPrice.toFixed(2)} €</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="block w-full bg-emerald-600 hover:bg-emerald-500 text-white text-center font-semibold py-3.5 rounded-full transition"
              >
                Finalizar Compra
              </Link>

              <button
                onClick={clearCart}
                className="w-full mt-3 text-sm text-gray-500 hover:text-red-500 transition"
              >
                Limpar carrinho
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}