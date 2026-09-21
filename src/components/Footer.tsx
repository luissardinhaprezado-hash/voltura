import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4">
              VOLT<span className="text-emerald-400">URA</span>
            </h3>
            <p className="text-sm">
              Mobilidade elétrica de alta performance.  
              Carros, motas e bicicletas elétricas com pneus gordos.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/produtos" className="hover:text-emerald-400">Produtos</Link></li>
              <li><Link href="/rastreio" className="hover:text-emerald-400">Rastrear Encomenda</Link></li>
              <li><Link href="/carrinho" className="hover:text-emerald-400">Carrinho</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contacto</h4>
            <p className="text-sm">
              Email: suporte@voltura.pt<br />
              Portugal • Enviamos para toda a Europa
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm">
          © {new Date().getFullYear()} Voltura. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  )
}