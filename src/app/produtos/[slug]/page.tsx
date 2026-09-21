import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import AddToCartButton from "@/components/AddToCartButton"

interface Props {
  params: Promise<{ slug: string }>
}

export default async function ProdutoPage({ params }: Props) {
  const { slug } = await params

  const product = await prisma.product.findUnique({
    where: { slug },
  })

  if (!product || !product.active) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Imagens */}
          <div>
            {product.images && product.images.length > 0 ? (
              <div className="space-y-4">
                <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-3">
                    {product.images.slice(1).map((img, i) => (
                      <div key={i} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-square bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
                Sem imagem
              </div>
            )}
          </div>

          {/* Informação */}
          <div>
            <p className="text-sm text-emerald-600 font-medium uppercase mb-2">
              {product.category}
            </p>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold">
                {Number(product.price).toFixed(2)} €
              </span>
              {product.compareAt && (
                <span className="text-lg text-gray-400 line-through">
                  {Number(product.compareAt).toFixed(2)} €
                </span>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed mb-8 whitespace-pre-line">
              {product.description}
            </p>

            <div className="flex items-center gap-4 mb-8">
              <span className="text-sm text-gray-500">
                Stock: <strong>{product.stock}</strong> unidades
              </span>
            </div>

            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                price: Number(product.price),
                image: product.images?.[0] || "",
                slug: product.slug,
              }}
            />

            <div className="mt-6">
              <Link href="/produtos" className="text-sm text-emerald-600 hover:underline">
                ← Voltar aos produtos
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}