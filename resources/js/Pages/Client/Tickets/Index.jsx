import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import Tooltip from '@/Components/Tooltip';
import { getUserFriendlyTicketTerm, getUserFriendlyStatus, getStatusDescription, getTermTooltip, getStandardizedStatusClass } from '@/Utils/userFriendlyTerms';

export default function ClientTicketsIndex({ auth, tickets }) {
    const ticketTerm = getUserFriendlyTicketTerm('client');

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Minhas {ticketTerm}s</h2>}
        >
            <Head title={`Minhas ${ticketTerm}s`} />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium">{ticketTerm}s</h3>
                                <Link
                                    href={route('client.tickets.create')}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200"
                                >
                                    Criar Nova {ticketTerm}
                                </Link>
                            </div>

                            {tickets.data.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 mb-4">Você ainda não tem nenhuma {ticketTerm.toLowerCase()}.</p>
                                    <Link
                                        href={route('client.tickets.create')}
                                        className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200"
                                    >
                                        Criar sua primeira {ticketTerm.toLowerCase()}
                                    </Link>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="pb-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                                    <Tooltip content="Número da solicitação" position="top">
                                                        <span>{ticketTerm}</span>
                                                    </Tooltip>
                                                </th>
                                                <th className="pb-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                                                <th className="pb-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                                    <Tooltip content="Número do contrato associado" position="top">
                                                        <span>Contrato</span>
                                                    </Tooltip>
                                                </th>
                                                <th className="pb-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                                    <Tooltip content={getTermTooltip('status')} position="top">
                                                        <span>Status</span>
                                                    </Tooltip>
                                                </th>
                                                <th className="pb-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Data</th>
                                                <th className="pb-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tickets.data.map((ticket) => (
                                                <tr key={ticket.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
                                                    <td className="py-4 text-sm font-medium text-gray-900">
                                                        {ticket.ticket_number}
                                                    </td>
                                                    <td className="py-4 text-sm text-gray-500">
                                                        {ticket.items.length > 0 ? ticket.items[0].product.descricao : 'N/A'}
                                                    </td>
                                                    <td className="py-4 text-sm text-gray-500">
                                                        {ticket.numero_contrato}
                                                    </td>
                                                    <td className="py-4">
                                                        <Tooltip 
                                                            content={getStatusDescription(ticket.status)}
                                                            position="top"
                                                        >
                                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStandardizedStatusClass(ticket.status)}`}>
                                                                {getUserFriendlyStatus(ticket.status)}
                                                            </span>
                                                        </Tooltip>
                                                    </td>
                                                    <td className="py-4 text-sm text-gray-500">
                                                        {new Date(ticket.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="py-4 text-sm font-medium">
                                                        <Link
                                                            href={route('client.tickets.show', ticket.id)}
                                                            className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
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