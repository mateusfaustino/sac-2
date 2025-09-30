import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import Tooltip from '@/Components/Tooltip';
import { getUserFriendlyTicketTerm, getUserFriendlyStatus, getStatusDescription, getBusinessTerm, getTermTooltip } from '@/Utils/userFriendlyTerms';

export default function AdminTicketShow({ auth, ticket }) {
    const ticketTerm = getUserFriendlyTicketTerm('admin');

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'aberto':
                return 'bg-yellow-100 text-yellow-800';
            case 'em_analise':
                return 'bg-blue-100 text-blue-800';
            case 'aprovado':
                return 'bg-green-100 text-green-800';
            case 'reprovado':
                return 'bg-red-100 text-red-800';
            case 'aguardando_envio':
                return 'bg-indigo-100 text-indigo-800';
            case 'em_transito':
                return 'bg-purple-100 text-purple-800';
            case 'recebido':
                return 'bg-teal-100 text-teal-800';
            case 'concluido':
                return 'bg-gray-100 text-gray-800';
            case 'cancelado':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const breadcrumbs = [
        { label: 'Painel', href: route('admin.dashboard') },
        { label: 'Tickets', href: route('admin.tickets.index') },
        { label: `${ticketTerm} #${ticket.ticket_number}`, href: route('admin.tickets.show', ticket.id) }
    ];

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Detalhes do {ticketTerm}</h2>}
            breadcrumbs={breadcrumbs}
        >
            <Head title={`Detalhes do ${ticketTerm}`} />

            <div className="py-4">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-6">
                                <Link
                                    href={route('admin.tickets.index')}
                                    className="text-blue-600 hover:text-blue-900"
                                >
                                    ← Voltar para {ticketTerm}s
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h3 className="text-lg font-medium mb-4">Informações do {ticketTerm}</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="font-medium">
                                                <Tooltip content={`Número da ${ticketTerm.toLowerCase()}`} position="right">
                                                    <span>{ticketTerm}:</span>
                                                </Tooltip>
                                            </label>
                                            <p className="ml-2 inline">{ticket.ticket_number}</p>
                                        </div>
                                        <div>
                                            <label className="font-medium">
                                                <Tooltip content={getTermTooltip('status')} position="right">
                                                    <span>Status:</span>
                                                </Tooltip>
                                            </label>
                                            <Tooltip 
                                                content={getStatusDescription(ticket.status)}
                                                position="right"
                                            >
                                                <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${ticket.status === 'aberto' ? 'bg-yellow-100 text-yellow-800' : ''}
                                                    ${ticket.status === 'em_analise' ? 'bg-blue-100 text-blue-800' : ''}
                                                    ${ticket.status === 'aprovado' ? 'bg-green-100 text-green-800' : ''}
                                                    ${ticket.status === 'reprovado' ? 'bg-red-100 text-red-800' : ''}
                                                    ${ticket.status === 'aguardando_envio' ? 'bg-indigo-100 text-indigo-800' : ''}
                                                    ${ticket.status === 'em_transito' ? 'bg-purple-100 text-purple-800' : ''}
                                                    ${ticket.status === 'recebido' ? 'bg-teal-100 text-teal-800' : ''}
                                                    ${ticket.status === 'concluido' ? 'bg-gray-100 text-gray-800' : ''}
                                                    ${ticket.status === 'cancelado' ? 'bg-gray-100 text-gray-800' : ''}
                                                `}>
                                                    {getUserFriendlyStatus(ticket.status)}
                                                </span>
                                            </Tooltip>
                                        </div>
                                        <div>
                                            <label className="font-medium">
                                                <Tooltip content={getTermTooltip('numero_contrato')} position="right">
                                                    <span>{getBusinessTerm('numero_contrato')}:</span>
                                                </Tooltip>
                                            </label>
                                            <p className="ml-2 inline">{ticket.numero_contrato}</p>
                                        </div>
                                        <div>
                                            <label className="font-medium">
                                                <Tooltip content={getTermTooltip('numero_nf')} position="right">
                                                    <span>{getBusinessTerm('numero_nf')}:</span>
                                                </Tooltip>
                                            </label>
                                            <p className="ml-2 inline">{ticket.numero_nf}</p>
                                        </div>
                                        <div>
                                            <label className="font-medium">
                                                <Tooltip content={getTermTooltip('numero_serie')} position="right">
                                                    <span>{getBusinessTerm('numero_serie')}:</span>
                                                </Tooltip>
                                            </label>
                                            <p className="ml-2 inline">{ticket.numero_serie || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <label className="font-medium">Criado em:</label>
                                            <p className="ml-2 inline">{new Date(ticket.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium mb-4">Informações do Cliente</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="font-medium">
                                                <Tooltip content={getTermTooltip('razao_social')} position="right">
                                                    <span>{getBusinessTerm('razao_social')}:</span>
                                                </Tooltip>
                                            </label>
                                            <p className="ml-2 inline">{ticket.client.razao_social}</p>
                                        </div>
                                        <div>
                                            <label className="font-medium">
                                                <Tooltip content={getTermTooltip('cnpj')} position="right">
                                                    <span>{getBusinessTerm('cnpj')}:</span>
                                                </Tooltip>
                                            </label>
                                            <p className="ml-2 inline">{ticket.client.cnpj}</p>
                                        </div>
                                        <div>
                                            <label className="font-medium">Email:</label>
                                            <p className="ml-2 inline">{ticket.client.email_notificacao}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-medium mb-4">Produtos</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Código
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Descrição
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Quantidade
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {ticket.items.map((item) => (
                                                <tr key={item.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {item.product.codigo}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {item.product.descricao}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {item.quantidade}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {ticket.descricao && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-medium mb-4">Descrição</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p>{ticket.descricao}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}