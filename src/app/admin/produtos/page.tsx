"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

type Product = {
  id: string
  name: string
  category: string
  price: number
  stock: number
  active: boolean
}

export default function AdminProdutosPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filtered, setFiltered] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState<string | null>(null)

  // Filtros
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("todos")
  const [status, setStatus] = useState("todos")

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    let result = [...products]

    // Pesquisa
    if (search.trim()) {
      const term = search.toLowerCase()
      result = result.filter((p) => p.name.toLowerCase().includes(term))
    }

    // Categoria
    if (category !== "todos") {
      result = result.filter((p) => p.category === category)
    }

    // Estado
    if (status === "ativo") {
      result = result.filter((p) => p.active)
    } else if (status === "inativo") {
      result = result.filter((p) => !p.active)
    } else if (status === "esgotado") {
      result = result.filter((p) => p.stock === 0)
    } else if (status === "stock-baixo") {
      result = result.filter((p) => p.stock > 0 && p.stock <= 3)
    }

    setFiltered(result)
  }, [products, search, category, status])

  async function loadProducts() {
    try {
      const res = await fetch("/api/admin/produtos")
      if (res.ok) {
        const data = await res.json()
        setProducts(data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Tens a certeza que queres apagar o produto "${name}"?`)) return

    setActionId(id)
    try {
      const res = await fetch(`/api/admin/produtos/${id}`, { method: "DELETE" })
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id))
      } else {
        alert("Erro ao apagar o produto")
      }
    } catch {
      alert("Erro ao apagar o produto")
    } finally {
      setActionId(null)
    }
  }

  async function handleToggleStock(id: string, currentStock: number) {
    setActionId(id)
    const newStock = currentStock > 0 ? 0 : 10

    try {
      const res = await fetch(`/api/admin/produtos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: newStock }),
      })

      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, stock: newStock } : p))
        )
      }
    } catch {
      alert("Erro ao atualizar stock")
    } finally {
      setActionId(null)
    }
  }

  async function handleDuplicate(id: string) {
    setActionId(id)
    try {
      const res = await fetch(`/api/admin/produtos/${id}/duplicate`, {
        method: "POST",
      })

      if (res.ok) {
        const newProduct = await res.json()
        setProducts((prev) => [newProduct, ...prev])
        alert("Produto duplicado com sucesso!")
      } else {
        alert("Erro ao duplicar produto")
      }
    } catch {
      alert("Erro ao duplicar produto")
    } finally {
      setActionId(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        A carregar...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/admin" className="font-bold text-xl">
            VOLT<span className="text-emerald-400">URA</span>
            <span className="text-sm font-normal text-gray-400 ml-3">Admin</span>
          </Link>
          <Link href="/admin" className="text-sm text-emerald-400 hover:underline">
            ← Voltar
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold">Produtos</h1>
          <Link
            href="/admin/produtos/novo"
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-lg font-medium transition text-center"
          >
            + Novo Produto
          </Link>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl p-4 border mb-6 space-y-3">
          <input
            type="text"
            placeholder="Pesquisar por nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="todos">Todas as categorias</option>
              <option value="bicicletas">Bicicletas</option>
              <option value="motas">Motas</option>
              <option value="carros">Carros</option>
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="todos">Todos os estados</option>
              <option value="ativo">Ativos</option>
              <option value="inativo">Inativos</option>
              <option value="esgotado">Esgotados</option>
              <option value="stock-baixo">Stock baixo (≤ 3)</option>
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-gray-500">
            Nenhum produto encontrado.
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-4 font-medium">Produto</th>
                    <th className="text-left px-4 py-4 font-medium">Categoria</th>
                    <th className="text-left px-4 py-4 font-medium">Preço</th>
                    <th className="text-left px-4 py-4 font-medium">Stock</th>
                    <th className="text-left px-4 py-4 font-medium">Estado</th>
                    <th className="text-left px-4 py-4 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((product) => (
                    <tr key={product.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="px-4 py-4 font-medium max-w-[180px] truncate">{product.name}</td>
                      <td className="px-4 py-4 capitalize">{product.category}</td>
                      <td className="px-4 py-4">{Number(product.price).toFixed(2)} €</td>
                      <td className="px-4 py-4">
                        <span className={product.stock <= 3 ? "text-red-500 font-medium" : ""}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          product.active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"
                        }`}>
                          {product.active ? "Ativo" : "Inativo"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <Link
                            href={`/admin/produtos/${product.id}`}
                            className="text-emerald-600 hover:underline font-medium"
                          >
                            Editar
                          </Link>
                          <button
                            onClick={() => handleToggleStock(product.id, product.stock)}
                            disabled={actionId === product.id}
                            className="text-orange-500 hover:underline font-medium disabled:opacity-50"
                          >
                            {product.stock > 0 ? "Esgotar" : "Repor"}
                          </button>
                          <button
                            onClick={() => handleDuplicate(product.id)}
                            disabled={actionId === product.id}
                            className="text-blue-500 hover:underline font-medium disabled:opacity-50"
                          >
                            Duplicar
                          </button>
                          <button
                            onClick={() => handleDelete(product.id, product.name)}
                            disabled={actionId === product.id}
                            className="text-red-500 hover:underline font-medium disabled:opacity-50"
                          >
                            Apagar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}