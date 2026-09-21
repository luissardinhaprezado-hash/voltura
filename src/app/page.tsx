import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-black via-gray-900 to-emerald-950 text-white">
          <div className="max-w-7xl mx-auto px-4 py-20 md:py-28 text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Mobilidade Elétrica<br />
              <span className="text-emerald-400">de Alta Performance</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10">
              Bicicletas elétricas fat tire, motas e carros elétricos.  
              Qualidade premium com envio para toda a Europa.
            </p>

            <div className="flex justify-center">
              <Link
                href="/produtos"
                className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-10 py-3.5 rounded-full transition text-lg"
              >
                Explorar Catálogo
              </Link>
            </div>
          </div>
        </section>

        {/* Destaques */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Porquê escolher a <span className="text-emerald-600">Voltura</span>?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 text-2xl">
                ⚡
              </div>
              <h3 className="font-semibold text-lg mb-2">Alta Performance</h3>
              <p className="text-gray-600 text-sm">
                Motores potentes, baterias de longa duração e pneus gordos para qualquer terreno.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 text-2xl">
                🚚
              </div>
              <h3 className="font-semibold text-lg mb-2">Envio Europeu</h3>
              <p className="text-gray-600 text-sm">
                Enviamos para Portugal e toda a Europa com tracking completo.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 text-2xl">
                🔒
              </div>
              <h3 className="font-semibold text-lg mb-2">Pagamento Seguro</h3>
              <p className="text-gray-600 text-sm">
                Pagamentos protegidos com Stripe (Cartão, MB Way e mais).
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-emerald-600 text-white">
          <div className="max-w-4xl mx-auto px-4 py-16 text-center">
            <h2 className="text-3xl font-bold mb-4">Pronto para a tua próxima aventura?</h2>
            <p className="text-emerald-100 mb-8">
              Explora a nossa coleção de veículos elétricos e encontra o modelo ideal.
            </p>
            <Link
              href="/produtos"
              className="inline-block bg-black hover:bg-gray-900 text-white font-semibold px-8 py-3.5 rounded-full transition"
            >
              Ver Todos os Produtos
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}