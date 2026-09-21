"use client"

import { useState } from "react"
import Link from "next/link"
import { useCart } from "@/context/CartContext"

export default function Header() {
  const { totalItems } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-black text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
            <span className="text-2xl font-bold tracking-tight">
              VOLT<span className="text-emerald-400">URA</span>
            </span>
          </Link>

          {/* Menu Desktop */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="/" className="hover:text-emerald-400 transition">Início</Link>
            <Link href="/produtos" className="hover:text-emerald-400 transition">Todos os Produtos</Link>
            <Link href="/categorias/bicicletas" className="hover:text-emerald-400 transition">Bicicletas</Link>
            <Link href="/categorias/motas" className="hover:text-emerald-400 transition">Motas</Link>
            <Link href="/categorias/carros" className="hover:text-emerald-400 transition">Carros</Link>
          </nav>

          <div className="flex items-center gap-3">
            {/* Carrinho */}
            <Link href="/carrinho" className="relative p-2 hover:text-emerald-400 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Botão Menu Mobile */}
            <button
              className="md:hidden p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {menuOpen && (
          <nav className="md:hidden pb-4 space-y-1">
            <Link href="/" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded hover:bg-white/10">Início</Link>
            <Link href="/produtos" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded hover:bg-white/10">Todos os Produtos</Link>
            <Link href="/categorias/bicicletas" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded hover:bg-white/10">Bicicletas</Link>
            <Link href="/categorias/motas" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded hover:bg-white/10">Motas</Link>
            <Link href="/categorias/carros" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded hover:bg-white/10">Carros</Link>
          </nav>
        )}
      </div>
    </header>
  )
}