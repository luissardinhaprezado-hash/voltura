"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

export default function NovoProdutoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [compareAt, setCompareAt] = useState("")
  const [stock, setStock] = useState("10")
  const [category, setCategory] = useState("bicicletas")
  const [alibabaUrl, setAlibabaUrl] = useState("")
  const [featured, setFeatured] = useState(false)

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setError("")

    const uploadedUrls: string[] = []

    for (const file of Array.from(files)) {
      const formData = new FormData()
      formData.append("file", file)

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!res.ok) throw new Error("Erro no upload")

        const data = await res.json()
        uploadedUrls.push(data.url)
      } catch (err) {
        setError("Erro ao carregar uma das imagens")
      }
    }

    setImages((prev) => [...prev, ...uploadedUrls])
    setUploading(false)
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/admin/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          price: parseFloat(price),
          compareAt: compareAt ? parseFloat(compareAt) : null,
          stock: parseInt(stock),
          category,
          alibabaUrl: alibabaUrl || null,
          featured,
          images,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Erro ao criar produto")
      }

      router.push("/admin/produtos")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-black text-white">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/admin/produtos" className="font-bold text-xl">
            VOLT<span className="text-emerald-400">URA</span>
          </Link>
          <Link href="/admin/produtos" className="text-sm text-emerald-400 hover:underline">
            ← Voltar
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-8">Novo Produto</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border space-y-6">
          
          {/* Upload de Imagens */}
          <div>
            <label className="block text-sm font-medium mb-2">Imagens do produto</label>
            
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                disabled={uploading}
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer inline-flex flex-col items-center gap-2"
              >
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl">
                  📷
                </div>
                <span className="text-sm font-medium text-emerald-600">
                  {uploading ? "A carregar..." : "Escolher imagens da galeria"}
                </span>
                <span className="text-xs text-gray-500">
                  Podes escolher várias imagens de uma vez
                </span>
              </label>
            </div>

            {/* Pré-visualização das imagens */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
                {images.map((url, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                    <img
                      src={url}
                      alt={`Imagem ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Nome */}
          <div>
            <label className="block text-sm font-medium mb-1">Nome do produto *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Ex: Bicicleta Elétrica Fat Tire 20''"
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium mb-1">Descrição *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Descreve as características do produto..."
            />
          </div>

          {/* Preço */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Preço (€) *</label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Preço riscado (€)</label>
              <input
                type="number"
                step="0.01"
                value={compareAt}
                onChange={(e) => setCompareAt(e.target.value)}
                className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Stock e Categoria */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Stock *</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
                className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Categoria *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="bicicletas">Bicicletas Elétricas</option>
                <option value="motas">Motas Elétricas</option>
                <option value="carros">Carros Elétricos</option>
              </select>
            </div>
          </div>

          {/* Link Alibaba */}
          <div>
            <label className="block text-sm font-medium mb-1">Link Alibaba (opcional)</label>
            <input
              type="url"
              value={alibabaUrl}
              onChange={(e) => setAlibabaUrl(e.target.value)}
              className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="https://..."
            />
          </div>

          {/* Destaque */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="featured"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="featured" className="text-sm">
              Produto em destaque na página inicial
            </label>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-lg transition disabled:opacity-60"
          >
            {loading ? "A guardar..." : "Guardar Produto"}
          </button>
        </form>
      </main>
    </div>
  )
}