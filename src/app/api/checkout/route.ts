import { NextResponse } from "next/server"
import Stripe from "stripe"
import { prisma } from "@/lib/prisma"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { items, customer, total } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 })
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Stripe não configurado" }, { status: 500 })
    }

    const orderNumber = `VT${Date.now().toString().slice(-8)}`

    const order = await prisma.order.create({
      data: {
        orderNumber,
        status: "PENDING",
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone || null,
        shippingAddress: customer.address,
        shippingCity: customer.city,
        shippingPostal: customer.postal,
        shippingCountry: customer.country,
        shippingNotes: customer.notes || null,
        subtotal: total,
        shippingCost: 0,
        total: total,
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    })

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: customer.email,
      line_items: items.map((item: any) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.name,
            images: item.image ? [item.image.startsWith("http") ? item.image : `${baseUrl}${item.image}`] : [],
          },
          unit_amount: Math.round(Number(item.price) * 100),
        },
        quantity: item.quantity,
      })),
      success_url: `${baseUrl}/sucesso?order=${order.orderNumber}`,
      cancel_url: `${baseUrl}/carrinho`,
      metadata: {
        orderId: order.id,
        orderNumber: order.orderNumber,
      },
    })

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error("Erro no checkout:", error)
    return NextResponse.json(
      { error: error.message || "Erro ao criar sessão de pagamento" },
      { status: 500 }
    )
  }
}