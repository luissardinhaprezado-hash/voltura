import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  const { id } = await params

  try {
    const original = await prisma.product.findUnique({
      where: { id },
    })

    if (!original) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 })
    }

    const baseSlug = original.slug + "-copia"
    let slug = baseSlug
    let counter = 1

    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    const newProduct = await prisma.product.create({
      data: {
        name: original.name + " (Cópia)",
        slug,
        description: original.description,
        price: original.price,
        compareAt: original.compareAt,
        images: original.images,
        stock: original.stock,
        category: original.category,
        featured: false,
        active: false, // começa inativo para poderes editar
        alibabaUrl: original.alibabaUrl,
      },
    })

    return NextResponse.json(newProduct)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erro ao duplicar produto" }, { status: 500 })
  }
}