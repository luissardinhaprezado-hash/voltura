import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { orderNumber, email } = await req.json()

    if (!orderNumber || !email) {
      return NextResponse.json({ error: "Número da encomenda e email são obrigatórios" }, { status: 400 })
    }

    const order = await prisma.order.findFirst({
      where: {
        orderNumber: orderNumber.trim().toUpperCase(),
        customerEmail: email.trim().toLowerCase(),
      },
      include: {
        items: {
          include: {
            product: {
              select: { name: true },
            },
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json({ error: "Encomenda não encontrada. Verifica o número e o email." }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erro ao procurar encomenda" }, { status: 500 })
  }
}