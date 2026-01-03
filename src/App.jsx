import { ShoppingBag, BadgeCheck, UserRound } from 'lucide-react';

export default function App() {

  return (
    <>
      <div>
        {/* Header */}
        <header className="bg-white sticky top-0 z-50">
          <div className="container mx-auto px-12 py-6">
            <div className="flex items-center justify-between">

              {/* Bloco Bebidas Monte Alto - escondido no mobile */}
              <div className="flex items-center gap-2 hidden md:flex">
                <ShoppingBag className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-lg font-bold">Bebidas Monte Alto</h1>
                  <p className="text-sm text-muted-foreground">Delivery rápido e fácil</p>
                </div>
              </div>

              {/* Bloco Compra segura - escondido no mobile */}
              <div className="flex items-center gap-2 hidden md:flex">
                <BadgeCheck className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-lg font-bold">Compra segura</h1>
                  <p className="text-sm text-muted-foreground">Distribuidoras disponivel</p>
                </div>
              </div>

              {/* Bloco Faça seu Login - sempre visível, alinhado à direita no mobile */}
              <div className="flex items-center gap-2 ml-auto md:ml-0">
                <UserRound className="h-8 w-8 text-primary" />
                <div className=" sm:block">
                  <h1 className="text-lg font-bold">Faça seu Login</h1>
                  <p className="text-sm text-muted-foreground">Bem vindo de volta!</p>
                </div>
              </div>

            </div>
          </div>
        </header>


        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">

          <div className="text-center py-20">
            <ShoppingBag className="lg:h-20 h-15 w-20 mx-auto mb-4 text-primary opacity-50" />
            <h2 className="lg:text-3xl text-lg font-bold mb-2">Bem-vindo ao Bebidas Monte Alto</h2>
            <p className="text-base mb-6">
              Faça login para começar a pedir suas bebidas favoritas
            </p>
            <button size="lg" className='p-3 rounded bg-gray-950 text-white'>
              Não possui uma conta? Cadastre-se
            </button>
          </div>

        </main>
      </div>    </>
  )
}