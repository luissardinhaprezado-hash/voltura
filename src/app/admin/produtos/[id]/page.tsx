"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"

export default function EditarProdutoPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [compareAt, setCompareAt] = useState("")
  const [stock, setStock] = useState("")
  const [category, setCategory] = useState("bicicletas")
  const [alibabaUrl, setAlibabaUrl] = useState("")
  const [featured, setFeatured] = useState(false)
  const [active, setActive] = useState(true)

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`/api/admin/produtos/${id}`)
        if (!res.ok) throw new Error("Produto não encontrado")
        const data = await res.json()

        setName(data.name)
        setDescription(data.description)
        setPrice(String(data.price))
        setCompareAt(data.compareAt ? String(data.compareAt) : "")
        setStock(String(data.stock))
        setCategory(data.category)
        setAlibabaUrl(data.alibabaUrl || "")
        setFeatured(data.featured)
        setActive(data.active)
        setImages(data.images || [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadProduct()
  }, [id])

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
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
      } catch {
        setError("Erro ao carregar imagem")
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
    setSaving(true)

    try {
      const res = await fetch(`/api/admin/produtos/${id}`, {
        method: "PUT",
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
          active,
          images,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Erro ao atualizar")
      }

      router.push("/admin/produtos")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p>A carregar...</p>
      </div>
    )
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
        <h1 className="text-2xl font-bold mb-8">Editar Produto</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border space-y-6">
          {/* Imagens */}
          <div>
            <label className="block text-sm font-medium mb-2">Imagens</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" id="image-upload" disabled={uploading} />
              <label htmlFor="image-upload" className="cursor-pointer inline-flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl">📷</div>
                <span className="text-sm font-medium text-emerald-600">
                  {uploading ? "A carregar..." : "Adicionar imagens da galeria"}
                </span>
              </label>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
                {images.map((url, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full text-xs">×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nome *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descrição *</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Preço (€) *</label>
              <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Preço riscado (€)</label>
              <input type="number" step="0.01" value={compareAt} onChange={(e) => setCompareAt(e.target.value)} className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Stock *</label>
              <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Categoria *</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="bicicletas">Bicicletas Elétricas</option>
                <option value="motas">Motas Elétricas</option>
                <option value="carros">Carros Elétricos</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Link Alibaba</label>
            <input type="url" value={alibabaUrl} onChange={(e) => setAlibabaUrl(e.target.value)} className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>

          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="w-4 h-4" />
              <span className="text-sm">Produto em destaque</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="w-4 h-4" />
              <span className="text-sm">Produto ativo (visível na loja)</span>
            </label>
          </div>

          {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>}

          <button type="submit" disabled={saving || uploading} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-lg transition disabled:opacity-60">
            {saving ? "A guardar..." : "Guardar Alterações"}
          </button>
        </form>
      </main>
    </div>
  )
}