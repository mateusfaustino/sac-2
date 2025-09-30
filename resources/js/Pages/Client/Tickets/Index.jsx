import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import Tooltip from '@/Components/Tooltip';
import { getUserFriendlyTicketTerm, getUserFriendlyStatus, getStatusDescription, getTermTooltip } from '@/Utils/userFriendlyTerms';

export default function ClientTicketsIndex({ auth, tickets }) {
    const ticketTerm = getUserFriendlyTicketTerm('client');

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Minhas {ticketTerm}s</h2>}
        >
            <Head title={`Minhas ${ticketTerm}s`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium">{ticketTerm}s</h3>
                                <Link
                                    href={route('client.tickets.create')}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    Criar Nova {ticketTerm}
                                </Link>
                            </div>

                            {tickets.data.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">Você ainda não tem nenhuma {ticketTerm.toLowerCase()}.</p>
                                    <Link
                                        href={route('client.tickets.create')}
                                        className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    >
                                        Criar sua primeira {ticketTerm.toLowerCase()}
                                    </Link>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    <Tooltip content="Número da solicitação" position="top">
                                                        <span>{ticketTerm}</span>
                                                    </Tooltip>
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    <Tooltip content="Número do contrato associado" position="top">
                                                        <span>Contrato</span>
                                                    </Tooltip>
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    <Tooltip content={getTermTooltip('status')} position="top">
                                                        <span>Status</span>
                                                    </Tooltip>
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {tickets.data.map((ticket) => (
                                                <tr key={ticket.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {ticket.ticket_number}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {ticket.items.length > 0 ? ticket.items[0].product.descricao : 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {ticket.numero_contrato}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <Tooltip 
                                                            content={getStatusDescription(ticket.status)}
                                                            position="top"
                                                        >
                                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                                ${ticket.status === 'aberto' ? 'bg-yellow-100 text-yellow-800' : ''}
                                                                ${ticket.status === 'em_analise' ? 'bg-blue-100 text-blue-800' : ''}
                                                                ${ticket.status === 'aprovado' ? 'bg-green-100 text-green-800' : ''}
                                                                ${ticket.status === 'reprovado' ? 'bg-red-100 text-red-800' : ''}
                                                                ${ticket.status === 'aguardando_envio' ? 'bg-purple-100 text-purple-800' : ''}
                                                                ${ticket.status === 'em_transito' ? 'bg-indigo-100 text-indigo-800' : ''}
                                                                ${ticket.status === 'recebido' ? 'bg-teal-100 text-teal-800' : ''}
                                                                ${ticket.status === 'concluido' ? 'bg-green-100 text-green-800' : ''}
                                                                ${ticket.status === 'cancelado' ? 'bg-gray-100 text-gray-800' : ''}
                                                            `}>
                                                                {getUserFriendlyStatus(ticket.status)}
                                                            </span>
                                                        </Tooltip>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(ticket.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <Link
                                                            href={route('client.tickets.show', ticket.id)}
                                                            className="text-blue-600 hover:text-blue-900"
                                                        >
                                                            Ver
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}