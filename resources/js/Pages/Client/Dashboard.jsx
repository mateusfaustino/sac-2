import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import Tooltip from '@/Components/Tooltip';
import { getUserFriendlyTicketTerm } from '@/Utils/userFriendlyTerms';

export default function ClientDashboard({ auth }) {
    const { props } = usePage();
    const { flash } = props;
    
    const ticketTerm = getUserFriendlyTicketTerm('client');

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Painel do Cliente</h2>}
        >
            <Head title="Painel do Cliente" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Flash message display */}
                            {flash?.error && (
                                <div className="mb-4 rounded-md bg-red-50 p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-red-800">
                                                {flash.error}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {flash?.success && (
                                <div className="mb-4 rounded-md bg-green-50 p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-green-800">
                                                {flash.success}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-blue-50 p-6 rounded-lg">
                                    <h3 className="text-lg font-medium text-blue-800">
                                        <Tooltip content={`Criar uma nova ${ticketTerm.toLowerCase()}`} position="top">
                                            <span>Criar Nova {ticketTerm}</span>
                                        </Tooltip>
                                    </h3>
                                    <p className="mt-2 text-blue-600">
                                        Envie uma nova solicitação de devolução para seus produtos.
                                    </p>
                                    <a 
                                        href={route('client.tickets.create')} 
                                        className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    >
                                        Criar {ticketTerm}
                                    </a>
                                </div>

                                <div className="bg-green-50 p-6 rounded-lg">
                                    <h3 className="text-lg font-medium text-green-800">
                                        <Tooltip content={`Visualizar todas as suas ${ticketTerm.toLowerCase()}s`} position="top">
                                            <span>Minhas {ticketTerm}s</span>
                                        </Tooltip>
                                    </h3>
                                    <p className="mt-2 text-green-600">
                                        Veja e acompanhe todas as suas solicitações de devolução.
                                    </p>
                                    <a 
                                        href={route('client.tickets.index')} 
                                        className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                    >
                                        Ver {ticketTerm}s
                                    </a>
                                </div>

                                <div className="bg-purple-50 p-6 rounded-lg">
                                    <h3 className="text-lg font-medium text-purple-800">Informações da Conta</h3>
                                    <p className="mt-2 text-purple-600">
                                        Gerencie seus dados e preferências da conta.
                                    </p>
                                    <a 
                                        href={route('profile.edit')} 
                                        className="mt-4 inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                                    >
                                        Configurações da Conta
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}