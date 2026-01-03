import { ShoppingBag, BadgeCheck, UserRound } from 'lucide-react';


export default function Pesquisa() {
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
                                    <h1 className="text-lg font-bold">Rafael Thomaz</h1>
                                    <p className="text-sm text-muted-foreground">Bem vindo!</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </header>

                <div className="flex flex-col items-center gap-4 pb-24">
                    <h1 className="text-3xl mt-5 font-bold text-center">
                        Onde vamos pedir hoje?
                    </h1>

                    <input
                        type="text"
                        placeholder="Peça alguma coisa"
                        className="
                        w-[90%] md:w-150
                        p-4
                        rounded-xl
                        border
                        bg-gray-200
                        shadow
                        border-gray-300
                        focus:outline-none
                        focus:ring-2
                        focus:ring-gray-900

                        fixed md:static
                        bottom-4
                        "
                    />
                </div>

            </div>

        </>
    )
}