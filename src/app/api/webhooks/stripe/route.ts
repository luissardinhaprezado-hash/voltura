import { NextResponse } from "next/server"
import Stripe from "stripe"
import { prisma } from "@/lib/prisma"
import { sendOrderConfirmationEmail } from "@/lib/email"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature") as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    )
  } catch (err: any) {
    console.error("Webhook Error:", err.message)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    const orderId = session.metadata?.orderId

    if (orderId) {
      try {
        const order = await prisma.order.update({
          where: { id: orderId },
          data: {
            status: "PAID",
            stripePaymentId: typeof session.payment_intent === "string"
              ? session.payment_intent
              : null,
          },
          include: {
            items: {
              include: { product: true },
            },
          },
        })

        console.log(`Encomenda ${order.orderNumber} atualizada para PAID`)

        // Envia email de confirmação
        if (process.env.RESEND_API_KEY) {
          await sendOrderConfirmationEmail({
            to: order.customerEmail,
            orderNumber: order.orderNumber,
            customerName: order.customerName,
            total: Number(order.total),
            items: order.items.map((item) => ({
              name: item.product?.name || "Produto",
              quantity: item.quantity,
              price: Number(item.price),
            })),
          })
          console.log(`Email enviado para ${order.customerEmail}`)
        }
      } catch (error) {
        console.error("Erro ao processar encomenda:", error)
      }
    }
  }

  return NextResponse.json({ received: true })
}