"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

type Order = {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  total: number
  status: string
  createdAt: string
}

const statusLabels: Record<string, string> = {
  PENDING: "Pendente",
  PAID: "Paga",
  PROCESSING: "Em processamento",
  SHIPPED: "Enviada",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelada",
}

export default function AdminEncomendasPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filtered, setFiltered] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("todos")

  useEffect(() => {
    loadOrders()
  }, [])

  useEffect(() => {
    let result = [...orders]

    if (search.trim()) {
      const term = search.toLowerCase()
      result = result.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(term) ||
          o.customerName.toLowerCase().includes(term) ||
          o.customerEmail.toLowerCase().includes(term)
      )
    }

    if (status !== "todos") {
      result = result.filter((o) => o.status === status)
    }

    setFiltered(result)
  }, [orders, search, status])

  async function loadOrders() {
    try {
      const res = await fetch("/api/admin/encomendas")
      if (res.ok) {
        const data = await res.json()
        setOrders(data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
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
        <h1 className="text-2xl font-bold mb-6">Encomendas</h1>

        {/* Filtros */}
        <div className="bg-white rounded-2xl p-4 border mb-6 space-y-3">
          <input
            type="text"
            placeholder="Pesquisar por nº, nome ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full sm:w-64 border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="todos">Todos os estados</option>
            <option value="PENDING">Pendente</option>
            <option value="PAID">Paga</option>
            <option value="PROCESSING">Em processamento</option>
            <option value="SHIPPED">Enviada</option>
            <option value="DELIVERED">Entregue</option>
            <option value="CANCELLED">Cancelada</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-gray-500">
            Nenhuma encomenda encontrada.
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-4 font-medium">Nº</th>
                    <th className="text-left px-4 py-4 font-medium">Cliente</th>
                    <th className="text-left px-4 py-4 font-medium">Total</th>
                    <th className="text-left px-4 py-4 font-medium">Estado</th>
                    <th className="text-left px-4 py-4 font-medium">Data</th>
                    <th className="text-left px-4 py-4 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order) => (
                    <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="px-4 py-4 font-medium">{order.orderNumber}</td>
                      <td className="px-4 py-4">
                        <div>{order.customerName}</div>
                        <div className="text-gray-500 text-xs">{order.customerEmail}</div>
                      </td>
                      <td className="px-4 py-4">{Number(order.total).toFixed(2)} €</td>
                      <td className="px-4 py-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          {statusLabels[order.status] || order.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("pt-PT")}
                      </td>
                      <td className="px-4 py-4">
                        <Link
                          href={`/admin/encomendas/${order.id}`}
                          className="text-emerald-600 hover:underline font-medium"
                        >
                          Ver detalhes
                        </Link>
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