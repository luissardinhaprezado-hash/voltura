import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendOrderConfirmationEmail({
  to,
  orderNumber,
  customerName,
  total,
  items,
}: {
  to: string
  orderNumber: string
  customerName: string
  total: number
  items: { name: string; quantity: number; price: number }[]
}) {
  try {
    await resend.emails.send({
      from: "Voltura <onboarding@resend.dev>",
      to,
      subject: `Confirmacao da tua encomenda ${orderNumber} - Voltura`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
          <h1 style="color: #059669;">Obrigado pela tua compra!</h1>
          <p>Ola <strong>${customerName}</strong>,</p>
          <p>A tua encomenda <strong>${orderNumber}</strong> foi confirmada com sucesso.</p>
          
          <h3 style="margin-top: 30px;">Resumo da encomenda:</h3>
          <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
            ${items.map(item => `
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;">
                  ${item.name} x ${item.quantity}
                </td>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">
                  ${(item.price * item.quantity).toFixed(2)} EUR
                </td>
              </tr>
            `).join("")}
          </table>
          
          <p style="font-size: 18px;"><strong>Total: ${total.toFixed(2)} EUR</strong></p>
          
          <p style="margin-top: 30px;">Podes acompanhar o estado da tua encomenda a qualquer momento:</p>
          <p>
            <a href="https://voltura-mu.vercel.app/rastreio" 
               style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Rastrear Encomenda
            </a>
          </p>
          
          <p style="color: #666; font-size: 13px; margin-top: 40px;">
            Voltura - Mobilidade Eletrica<br/>
            Este e um email automatico.
          </p>
        </div>
      `,
    })
    return { success: true }
  } catch (error) {
    console.error("Erro ao enviar email:", error)
    return { success: false, error }
  }
}