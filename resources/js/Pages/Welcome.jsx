import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Portal de Devoluções" />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                {/* Header */}
                <header className="bg-white shadow-sm">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-10 w-10 text-indigo-600" viewBox="0 0 316 316" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M305.8 81.125C305.77 80.995 305.69 80.885 305.65 80.755C305.56 80.525 305.49 80.285 305.37 80.075C305.29 79.935 305.17 79.815 305.07 79.685C304.94 79.515 304.83 79.325 304.68 79.175C304.55 79.045 304.39 78.955 304.25 78.845C304.09 78.715 303.95 78.575 303.77 78.475L251.32 48.275C249.97 47.495 248.31 47.495 246.96 48.275L194.51 78.475C194.33 78.575 194.19 78.725 194.03 78.845C193.89 78.955 193.73 79.045 193.6 79.175C193.45 79.325 193.34 79.515 193.21 79.685C193.11 79.815 192.99 79.935 192.91 80.075C192.79 80.285 192.71 80.525 192.63 80.755C192.58 80.875 192.51 80.995 192.48 81.125C192.38 81.495 192.33 81.875 192.33 82.265V139.625L148.62 164.795V52.575C148.62 52.185 148.57 51.805 148.47 51.435C148.44 51.305 148.36 51.195 148.32 51.065C148.23 50.835 148.16 50.595 148.04 50.385C147.96 50.245 147.84 50.125 147.74 49.995C147.61 49.825 147.5 49.635 147.35 49.485C147.22 49.355 147.06 49.265 146.92 49.155C146.76 49.025 146.62 48.885 146.44 48.785L93.99 18.585C92.64 17.805 90.98 17.805 89.63 18.585L37.18 48.785C37 48.885 36.86 49.035 36.7 49.155C36.56 49.265 36.4 49.355 36.27 49.485C36.12 49.635 36.01 49.825 35.88 49.995C35.78 50.125 35.66 50.245 35.58 50.385C35.46 50.595 35.38 50.835 35.3 51.065C35.25 51.185 35.18 51.305 35.15 51.435C35.05 51.805 35 52.185 35 52.575V232.235C35 233.795 35.84 235.245 37.19 236.025L142.1 296.425C142.33 296.555 142.58 296.635 142.82 296.725C142.93 296.765 143.04 296.835 143.16 296.865C143.53 296.965 143.9 297.015 144.28 297.015C144.66 297.015 145.03 296.965 145.4 296.865C145.5 296.835 145.59 296.775 145.69 296.745C145.95 296.655 146.21 296.565 146.45 296.435L251.36 236.035C252.72 235.255 253.55 233.815 253.55 232.245V174.885L303.81 145.945C305.17 145.165 306 143.725 306 142.155V82.265C305.95 81.875 305.89 81.495 305.8 81.125ZM144.2 227.205L100.57 202.515L146.39 176.135L196.66 147.195L240.33 172.335L208.29 190.625L144.2 227.205ZM244.75 114.995V164.795L226.39 154.225L201.03 139.625V89.825L219.39 100.395L244.75 114.995ZM249.12 57.105L292.81 82.265L249.12 107.425L205.43 82.265L249.12 57.105ZM114.49 184.425L96.13 194.995V85.305L121.49 70.705L139.85 60.135V169.815L114.49 184.425ZM91.76 27.425L135.45 52.585L91.76 77.745L48.07 52.585L91.76 27.425ZM43.67 60.135L62.03 70.705L87.39 85.305V202.545V202.555V202.565C87.39 202.735 87.44 202.895 87.46 203.055C87.49 203.265 87.49 203.485 87.55 203.695V203.705C87.6 203.875 87.69 204.035 87.76 204.195C87.84 204.375 87.89 204.575 87.99 204.745C87.99 204.745 87.99 204.755 88 204.755C88.09 204.905 88.22 205.035 88.33 205.175C88.45 205.335 88.55 205.495 88.69 205.635L88.7 205.645C88.82 205.765 88.98 205.855 89.12 205.965C89.28 206.085 89.42 206.225 89.59 206.325C89.6 206.325 89.6 206.325 89.61 206.335C89.62 206.335 89.62 206.345 89.63 206.345L139.87 234.775V285.065L43.67 229.705V60.135ZM244.75 229.705L148.58 285.075V234.775L219.8 194.115L244.75 179.875V229.705ZM297.2 139.625L253.49 164.795V114.995L278.85 100.395L297.21 89.825V139.625H297.2Z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h1 className="text-2xl font-bold text-gray-900">Portal de Devoluções</h1>
                            </div>
                        </div>
                        <nav className="flex space-x-4">
                            {auth.user ? (
                                auth.user.role === 'admin' ? (
                                    <Link
                                        href={route('admin.dashboard')}
                                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        Painel Administrativo
                                    </Link>
                                ) : (
                                    <Link
                                        href={route('client.dashboard')}
                                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        Meu Painel
                                    </Link>
                                )
                            ) : (
                                <>
                                    <Link
                                        href={route('client.login.form')}
                                        className="rounded-md bg-white px-4 py-2 text-sm font-medium text-indigo-600 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        Entrar
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        Registrar
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Hero Section */}
                <div className="py-12">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                                <span className="block">Sistema de Gestão de</span>
                                <span className="block text-indigo-600">Devoluções e SAC</span>
                            </h1>
                            <p className="mx-auto mt-3 max-w-md text-base text-gray-500 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
                                Solicite devoluções de produtos de forma simples e acompanhe todo o processo em tempo real.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="py-12 bg-white">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="lg:text-center">
                            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Como funciona</h2>
                            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                                Processo simples e eficiente
                            </p>
                            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                                Nosso sistema permite que você registre solicitações de devolução e acompanhe todo o processo de análise e aprovação.
                            </p>
                        </div>

                        <div className="mt-10">
                            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
                                {/* Step 1 */}
                                <div className="relative">
                                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                        <span className="text-lg font-bold">1</span>
                                    </div>
                                    <div className="ml-16">
                                        <h3 className="text-lg font-medium text-gray-900">Registre sua solicitação</h3>
                                        <p className="mt-2 text-base text-gray-500">
                                            Faça login com seu CNPJ e registre uma nova solicitação de devolução informando os dados do produto, contrato e nota fiscal.
                                        </p>
                                    </div>
                                </div>

                                {/* Step 2 */}
                                <div className="relative">
                                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                        <span className="text-lg font-bold">2</span>
                                    </div>
                                    <div className="ml-16">
                                        <h3 className="text-lg font-medium text-gray-900">Acompanhe o processo</h3>
                                        <p className="mt-2 text-base text-gray-500">
                                            Receba atualizações em tempo real sobre o status da sua solicitação, desde a análise até a aprovação final.
                                        </p>
                                    </div>
                                </div>

                                {/* Step 3 */}
                                <div className="relative">
                                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                        <span className="text-lg font-bold">3</span>
                                    </div>
                                    <div className="ml-16">
                                        <h3 className="text-lg font-medium text-gray-900">Receba a devolutiva</h3>
                                        <p className="mt-2 text-base text-gray-500">
                                            Após a aprovação, siga as instruções fornecidas para enviar o produto e receba o reembolso ou substituição.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="py-12 bg-gray-50">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="lg:text-center">
                            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Benefícios</h2>
                            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                                Por que usar nosso sistema?
                            </p>
                        </div>

                        <div className="mt-10">
                            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-900">Segurança e confiabilidade</h3>
                                        <p className="mt-2 text-base text-gray-500">
                                            Sistema seguro com autenticação por CNPJ e criptografia de dados para proteger suas informações.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-900">Transparência total</h3>
                                        <p className="mt-2 text-base text-gray-500">
                                            Acompanhe cada etapa do processo de devolução em tempo real com histórico completo de status.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4 4 0 003 15z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-900">Rastreabilidade completa</h3>
                                        <p className="mt-2 text-base text-gray-500">
                                            Todo o processo é registrado e auditado, garantindo total rastreabilidade das solicitações.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-900">Comunicação direta</h3>
                                        <p className="mt-2 text-base text-gray-500">
                                            Troque mensagens diretamente com nossa equipe de atendimento durante todo o processo.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                {!auth.user && (
                    <div className="bg-indigo-700">
                        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
                            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                                <span className="block">Pronto para começar?</span>
                                <span className="block text-indigo-200">Registre-se ou faça login agora mesmo.</span>
                            </h2>
                            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                                <div className="inline-flex rounded-md shadow">
                                    <Link
                                        href={route('register')}
                                        className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
                                    >
                                        Registrar minha empresa
                                    </Link>
                                </div>
                                <div className="ml-3 inline-flex rounded-md shadow">
                                    <Link
                                        href={route('client.login.form')}
                                        className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                    >
                                        Entrar com CNPJ
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <footer className="bg-gray-800">
                    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-center">
                            <p className="text-base text-gray-400">
                                &copy; 2025 Portal de Devoluções. Todos os direitos reservados.
                            </p>
                        </div>
                        {/* Admin login link - discreetly placed in footer */}
                        {!auth.user && (
                            <div className="mt-4 text-center">
                                <Link 
                                    href={route('login')} 
                                    className="text-xs text-gray-500 hover:text-gray-300 transition-colors duration-200"
                                >
                                    Acesso administrativo
                                </Link>
                            </div>
                        )}
                    </div>
                </footer>
            </div>
        </>
    );
}