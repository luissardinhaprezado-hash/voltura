import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function AdminPage() {
  const session = await auth()

  if (!session) {
    redirect("/admin/login")
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Admin */}
      <header className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-bold text-xl">
            VOLT<span className="text-emerald-400">URA</span>
            <span className="text-sm font-normal text-gray-400 ml-3">Admin</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-300">{session.user?.email}</span>
            <Link
              href="/"
              className="text-emerald-400 hover:underline"
            >
              Ver loja
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-8">Painel de Administração</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card Produtos */}
          <Link
            href="/admin/produtos"
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:border-emerald-500 hover:shadow-md transition"
          >
            <div className="text-3xl mb-3">📦</div>
            <h2 className="font-semibold text-lg">Produtos</h2>
            <p className="text-gray-500 text-sm mt-1">
              Adicionar, editar e gerir bicicletas, motas e carros elétricos
            </p>
          </Link>

          {/* Card Encomendas */}
          <Link
            href="/admin/encomendas"
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:border-emerald-500 hover:shadow-md transition"
          >
            <div className="text-3xl mb-3">🛒</div>
            <h2 className="font-semibold text-lg">Encomendas</h2>
            <p className="text-gray-500 text-sm mt-1">
              Ver e gerir todas as encomendas dos clientes
            </p>
          </Link>

          {/* Card Categorias */}
          <Link
            href="/admin/produtos/novo"
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:border-emerald-500 hover:shadow-md transition"
          >
            <div className="text-3xl mb-3">➕</div>
            <h2 className="font-semibold text-lg">Novo Produto</h2>
            <p className="text-gray-500 text-sm mt-1">
              Adicionar bicicleta, mota ou carro elétrico
            </p>
          </Link>
        </div>
      </main>
    </div>
  )
}