import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

export default function AdminTicketShow({ auth, ticket }) {
    const breadcrumbs = [
        { label: 'Painel', href: route('admin.dashboard') },
        { label: 'Tickets', href: route('admin.tickets.index') },
        { label: `Ticket #${ticket.ticket_number}`, href: route('admin.tickets.show', ticket.id) }
    ];

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Detalhes do Ticket</h2>}
            breadcrumbs={breadcrumbs}
        >
            <Head title="Detalhes do Ticket" />

            <div className="py-4">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-6">
                                <Link
                                    href={route('admin.tickets.index')}
                                    className="text-blue-600 hover:text-blue-900"
                                >
                                    ← Voltar para Tickets
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h3 className="text-lg font-medium mb-4">Informações do Ticket</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="font-medium">Número do Ticket:</label>
                                            <p className="ml-2 inline">{ticket.ticket_number}</p>
                                        </div>
                                        <div>
                                            <label className="font-medium">Status:</label>
                                            <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
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
                                                {ticket.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <div>
                                            <label className="font-medium">Número do Contrato:</label>
                                            <p className="ml-2 inline">{ticket.numero_contrato}</p>
                                        </div>
                                        <div>
                                            <label className="font-medium">Número da Nota Fiscal:</label>
                                            <p className="ml-2 inline">{ticket.numero_nf}</p>
                                        </div>
                                        <div>
                                            <label className="font-medium">Número de Série:</label>
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
                                            <label className="font-medium">Razão Social:</label>
                                            <p className="ml-2 inline">{ticket.client.razao_social}</p>
                                        </div>
                                        <div>
                                            <label className="font-medium">CNPJ:</label>
                                            <p className="ml-2 inline">{ticket.client.cnpj}</p>
                                        </div>
                                        <div>
                                            <label className="font-medium">Email:</label>
                                            <p className="ml-2 inline">{ticket.client.email}</p>
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

                            <div className="flex justify-end space-x-2">
                                <Link
                                    href={route('admin.tickets.edit', ticket.id)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    Editar Ticket
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}