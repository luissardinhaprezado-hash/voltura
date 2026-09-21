"use client"

import { useState } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Link from "next/link"

const statusLabels: Record<string, string> = {
  PENDING: "Aguardando pagamento",
  PAID: "Pagamento confirmado",
  PROCESSING: "Em preparação no armazém",
  SHIPPED: "Em trânsito",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelada",
}

// Etapas realistas de envio da China → Portugal
function getTrackingTimeline(status: string, createdAt: string) {
  const created = new Date(createdAt)
  
  const stages = [
    {
      key: "PAID",
      title: "Pagamento confirmado",
      description: "A tua encomenda foi recebida e está a ser processada.",
      location: "Armazém Shenzhen, China",
      date: created,
    },
    {
      key: "PROCESSING",
      title: "Em preparação",
      description: "Os produtos estão a ser separados e embalados no armazém.",
      location: "Armazém Shenzhen, China",
      date: new Date(created.getTime() + 1 * 24 * 60 * 60 * 1000),
    },
    {
      key: "SHIPPED_1",
      title: "Saiu do armazém",
      description: "A encomenda saiu do armazém e está a caminho do aeroporto.",
      location: "Shenzhen, China",
      date: new Date(created.getTime() + 2 * 24 * 60 * 60 * 1000),
    },
    {
      key: "SHIPPED_2",
      title: "Em trânsito internacional",
      description: "A encomenda está a ser transportada para a Europa.",
      location: "Em voo / trânsito internacional",
      date: new Date(created.getTime() + 4 * 24 * 60 * 60 * 1000),
    },
    {
      key: "SHIPPED_3",
      title: "Chegou a Portugal",
      description: "A encomenda chegou a território português e está em processo de alfândega.",
      location: "Lisboa / Porto, Portugal",
      date: new Date(created.getTime() + 8 * 24 * 60 * 60 * 1000),
    },
    {
      key: "SHIPPED_4",
      title: "Libertada da alfândega",
      description: "A encomenda foi libertada e está a caminho do centro de distribuição.",
      location: "Centro de distribuição Portugal",
      date: new Date(created.getTime() + 10 * 24 * 60 * 60 * 1000),
    },
    {
      key: "DELIVERED",
      title: "Entregue",
      description: "A encomenda foi entregue com sucesso.",
      location: "Morada de entrega",
      date: new Date(created.getTime() + 12 * 24 * 60 * 60 * 1000),
    },
  ]

  // Determina até que etapa mostrar com base no status real
  let maxIndex = 0
  if (status === "PAID") maxIndex = 0
  else if (status === "PROCESSING") maxIndex = 1
  else if (status === "SHIPPED") maxIndex = 4
  else if (status === "DELIVERED") maxIndex = 6
  else if (status === "CANCELLED") maxIndex = -1

  return stages.map((stage, index) => ({
    ...stage,
    completed: index <= maxIndex,
    current: index === maxIndex,
  }))
}

export default function RastreioPage() {
  const [orderNumber, setOrderNumber] = useState("")
  const [email, setEmail] = useState("")
  const [order, setOrder] = useState<any>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setOrder(null)
    setLoading(true)

    try {
      const res = await fetch("/api/rastreio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber, email }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Encomenda não encontrada")
      }

      setOrder(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const timeline = order ? getTrackingTimeline(order.status, order.createdAt) : []

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-2xl mx-auto px-4 py-12 w-full">
        <h1 className="text-3xl font-bold text-center mb-2">Rastrear Encomenda</h1>
        <p className="text-gray-500 text-center mb-10">
          Introduz o número da encomenda e o email usado na compra
        </p>

        <form onSubmit={handleSearch} className="bg-white rounded-2xl p-6 border shadow-sm space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Número da encomenda</label>
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              required
              placeholder="Ex: VT12345678"
              className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email da compra</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="O email que usaste no checkout"
              className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-lg transition disabled:opacity-60"
          >
            {loading ? "A procurar..." : "Rastrear Encomenda"}
          </button>
        </form>

        {/* Resultado do rastreio */}
        {order && (
          <div className="mt-8 space-y-6">
            {/* Cabeçalho */}
            <div className="bg-white rounded-2xl p-6 border shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Encomenda</p>
                  <p className="text-xl font-bold">{order.orderNumber}</p>
                </div>
                <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800 self-start">
                  {statusLabels[order.status] || order.status}
                </span>
              </div>

              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-medium">Origem:</span> Armazém Shenzhen, Guangdong, China</p>
                <p><span className="font-medium">Destino:</span> Portugal</p>
                <p><span className="font-medium">Transportadora:</span> Cainiao International / Correios de Portugal</p>
              </div>
            </div>

            {/* Timeline de rastreio */}
            <div className="bg-white rounded-2xl p-6 border shadow-sm">
              <h2 className="font-bold text-lg mb-6">Acompanhamento</h2>

              <div className="space-y-0">
                {timeline.map((stage, index) => (
                  <div key={stage.key} className="flex gap-4">
                    {/* Linha vertical + bolinha */}
                    <div className="flex flex-col items-center">
                      <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                        stage.completed 
                          ? "bg-emerald-500 border-emerald-500" 
                          : "bg-white border-gray-300"
                      }`} />
                      {index < timeline.length - 1 && (
                        <div className={`w-0.5 flex-1 min-h-[60px] ${
                          stage.completed ? "bg-emerald-500" : "bg-gray-200"
                        }`} />
                      )}
                    </div>

                    {/* Conteúdo */}
                    <div className={`pb-8 ${stage.current ? "opacity-100" : stage.completed ? "opacity-90" : "opacity-40"}`}>
                      <p className={`font-semibold ${stage.current ? "text-emerald-600" : ""}`}>
                        {stage.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-0.5">{stage.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{stage.location}</p>
                      {stage.completed && (
                        <p className="text-xs text-gray-400 mt-1">
                          {stage.date.toLocaleDateString("pt-PT", { day: "2-digit", month: "short", year: "numeric" })}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Produtos (sem morada pessoal) */}
            <div className="bg-white rounded-2xl p-6 border shadow-sm">
              <h2 className="font-bold mb-4">Produtos</h2>
              <div className="space-y-3">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.product?.name || "Produto"} × {item.quantity}</span>
                    <span className="font-medium">{(Number(item.price) * item.quantity).toFixed(2)} €</span>
                  </div>
                ))}
              </div>
              <div className="border-t mt-4 pt-4 flex justify-between font-bold">
                <span>Total</span>
                <span>{Number(order.total).toFixed(2)} €</span>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mt-10">
          <Link href="/" className="text-emerald-600 hover:underline text-sm">
            ← Voltar à loja
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}