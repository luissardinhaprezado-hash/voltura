import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const email = "admin@voltura.pt"
  const password = "Voltura2026!"
  const name = "Administrador Voltura"

  const hashedPassword = await bcrypt.hash(password, 12)

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name,
      password: hashedPassword,
      role: "ADMIN",
    },
  })

  console.log("=================================")
  console.log("Admin criado com sucesso!")
  console.log("Email:    admin@voltura.pt")
  console.log("Password: Voltura2026!")
  console.log("=================================")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })