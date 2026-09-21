import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(products)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { name, description, price, compareAt, stock, category, alibabaUrl, featured, images } = body

    if (!name || !description || !price || !category) {
      return NextResponse.json({ error: "Campos obrigatórios em falta" }, { status: 400 })
    }

    const baseSlug = slugify(name)
    let slug = baseSlug
    let counter = 1

    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        compareAt: compareAt || null,
        stock: stock || 0,
        category,
        alibabaUrl: alibabaUrl || null,
        featured: featured || false,
        images: images || [],
        active: true,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erro ao criar produto" }, { status: 500 })
  }
}