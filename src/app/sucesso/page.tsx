import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default function SucessoPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
            ✓
          </div>

          <h1 className="text-3xl font-bold mb-3">Pagamento confirmado!</h1>

          <p className="text-gray-600 mb-2">
            Obrigado pela tua compra.
          </p>

          <p className="text-gray-600 mb-8">
            Vais receber um email de confirmação em breve com os detalhes da tua encomenda.
          </p>

          <Link
            href="/"
            className="inline-block bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-8 py-3 rounded-full transition"
          >
            Continuar a comprar
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}