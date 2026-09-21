import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  const { id } = await params

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  })

  if (!order) {
    return NextResponse.json({ error: "Encomenda não encontrada" }, { status: 404 })
  }

  return NextResponse.json(order)
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()

  try {
    const order = await prisma.order.update({
      where: { id },
      data: {
        status: body.status,
        shippingNotes: body.shippingNotes || null,
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erro ao atualizar encomenda" }, { status: 500 })
  }
}