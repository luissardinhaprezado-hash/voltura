"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"

const statusOptions = [
  "PENDING",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
]

const statusLabels: Record<string, string> = {
  PENDING: "Pendente",
  PAID: "Paga",
  PROCESSING: "Em processamento",
  SHIPPED: "Enviada",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelada",
}

export default function EncomendaDetalhePage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState("")
  const [notes, setNotes] = useState("")
  const [message, setMessage] = useState("")

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/admin/encomendas/${id}`)
      if (res.ok) {
        const data = await res.json()
        setOrder(data)
        setStatus(data.status)
        setNotes(data.shippingNotes || "")
      }
      setLoading(false)
    }
    load()
  }, [id])

  async function handleUpdate() {
    setSaving(true)
    setMessage("")

    try {
      const res = await fetch(`/api/admin/encomendas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, shippingNotes: notes }),
      })

      if (!res.ok) throw new Error("Erro ao atualizar")

      setMessage("Encomenda atualizada com sucesso")
      const data = await res.json()
      setOrder(data)
    } catch {
      setMessage("Erro ao guardar alterações")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        A carregar...
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        Encomenda não encontrada
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-black text-white">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/admin/encomendas" className="font-bold text-xl">
            VOLT<span className="text-emerald-400">URA</span>
          </Link>
          <Link href="/admin/encomendas" className="text-sm text-emerald-400 hover:underline">
            ← Voltar
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">Encomenda {order.orderNumber}</h1>
            <p className="text-gray-500 text-sm">
              {new Date(order.createdAt).toLocaleString("pt-PT")}
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 self-start">
            {statusLabels[order.status] || order.status}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Dados do cliente */}
          <div className="bg-white rounded-2xl p-6 border">
            <h2 className="font-bold mb-4">Cliente</h2>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-500">Nome:</span> {order.customerName}</p>
              <p><span className="text-gray-500">Email:</span> {order.customerEmail}</p>
              {order.customerPhone && (
                <p><span className="text-gray-500">Telefone:</span> {order.customerPhone}</p>
              )}
            </div>
          </div>

          {/* Morada */}
          <div className="bg-white rounded-2xl p-6 border">
            <h2 className="font-bold mb-4">Morada de Envio</h2>
            <div className="space-y-1 text-sm">
              <p>{order.shippingAddress}</p>
              <p>{order.shippingPostal} {order.shippingCity}</p>
              <p>{order.shippingCountry}</p>
            </div>
          </div>

          {/* Totais */}
          <div className="bg-white rounded-2xl p-6 border">
            <h2 className="font-bold mb-4">Totais</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span>{Number(order.subtotal).toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Envio</span>
                <span>{Number(order.shippingCost).toFixed(2)} €</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-2 border-t">
                <span>Total</span>
                <span>{Number(order.total).toFixed(2)} €</span>
              </div>
            </div>
          </div>
        </div>

        {/* Produtos */}
        <div className="bg-white rounded-2xl p-6 border mt-6">
          <h2 className="font-bold mb-4">Produtos</h2>
          <div className="space-y-3">
            {order.items?.map((item: any) => (
              <div key={item.id} className="flex justify-between text-sm border-b pb-3 last:border-0">
                <div>
                  <p className="font-medium">{item.product?.name || "Produto"}</p>
                  <p className="text-gray-500">Qtd: {item.quantity}</p>
                </div>
                <p className="font-medium">{(Number(item.price) * item.quantity).toFixed(2)} €</p>
              </div>
            ))}
          </div>
        </div>

        {/* Alterar estado + Notas */}
        <div className="bg-white rounded-2xl p-6 border mt-6 space-y-5">
          <h2 className="font-bold">Gerir Encomenda</h2>

          <div>
            <label className="block text-sm font-medium mb-1">Estado</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full sm:w-64 border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {statusLabels[s]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notas internas</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Ex: Cliente pediu entrega ao fim de semana..."
            />
          </div>

          {message && (
            <div className={`text-sm px-4 py-3 rounded-lg ${message.includes("sucesso") ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
              {message}
            </div>
          )}

          <button
            onClick={handleUpdate}
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-2.5 rounded-lg transition disabled:opacity-60"
          >
            {saving ? "A guardar..." : "Guardar Alterações"}
          </button>
        </div>
      </main>
    </div>
  )
}