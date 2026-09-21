import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { notFound } from "next/navigation"

interface Props {
  params: Promise<{ categoria: string }>
}

const categoryNames: Record<string, string> = {
  bicicletas: "Bicicletas Elétricas",
  motas: "Motas Elétricas",
  carros: "Carros Elétricos",
}

export default async function CategoriaPage({ params }: Props) {
  const { categoria } = await params

  if (!["bicicletas", "motas", "carros"].includes(categoria)) {
    notFound()
  }

  const products = await prisma.product.findMany({
    where: {
      active: true,
      category: categoria,
    },
    orderBy: { createdAt: "desc" },
  })

  const title = categoryNames[categoria] || categoria

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-10 w-full">
        <h1 className="text-3xl font-bold mb-8">{title}</h1>

        {products.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            Ainda não existem produtos nesta categoria.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/produtos/${product.slug}`}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition group"
              >
                <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      Sem imagem
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h2 className="font-semibold text-lg leading-tight mb-2 line-clamp-2">
                    {product.name}
                  </h2>

                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold">
                      {Number(product.price).toFixed(2)} €
                    </span>
                    {product.compareAt && (
                      <span className="text-sm text-gray-400 line-through">
                        {Number(product.compareAt).toFixed(2)} €
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}