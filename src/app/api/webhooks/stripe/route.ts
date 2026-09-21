import { NextResponse } from "next/server"
import Stripe from "stripe"
import { prisma } from "@/lib/prisma"

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
        await prisma.order.update({
          where: { id: orderId },
          data: {
            status: "PAID",
            stripePaymentId: typeof session.payment_intent === "string" 
              ? session.payment_intent 
              : session.payment_intent?.id || null,
          },
        })
        console.log(`Encomenda ${orderId} atualizada para PAID`)
      } catch (error) {
        console.error("Erro ao atualizar encomenda:", error)
      }
    }
  }

  return NextResponse.json({ received: true })
}