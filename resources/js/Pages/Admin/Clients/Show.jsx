import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

export default function AdminClientShow({ auth, client, tickets }) {
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
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        const statusMap = {
            'aberto': 'Aberto',
            'em_analise': 'Em Análise',
            'aprovado': 'Aprovado',
            'reprovado': 'Reprovado',
            'aguardando_envio': 'Aguardando Envio',
            'em_transito': 'Em Trânsito',
            'recebido': 'Recebido',
            'concluido': 'Concluído'
        };
        return statusMap[status] || status;
    };

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Detalhes do Cliente</h2>}
        >
            <Head title="Detalhes do Cliente" />

            <div className="py-4">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium">Informações do Cliente</h3>
                                <Link
                                    href={route('admin.clients.index')}
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                >
                                    Voltar para lista
                                </Link>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Razão Social</label>
                                        <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                                            {client.razao_social}
                                        </div>
                                    </div>
                                    
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">CNPJ</label>
                                        <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                                            {client.cnpj}
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">E-mail de Notificação</label>
                                        <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                                            {client.email_notificacao || 'N/A'}
                                        </div>
                                    </div>
                                    
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Quantidade de Tickets</label>
                                        <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                                            {client.tickets_count}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium mb-6">Tickets do Cliente</h3>
                            
                            {/* Tickets Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {tickets.data && tickets.data.length > 0 ? (
                                            tickets.data.map((ticket) => (
                                                <tr key={ticket.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {ticket.ticket_number}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {ticket.items && ticket.items.length > 0 
                                                            ? ticket.items.map(item => item.product?.descricao).join(', ') 
                                                            : 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(ticket.status)}`}>
                                                            {getStatusText(ticket.status)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {new Date(ticket.created_at).toLocaleDateString('pt-BR')}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <Link 
                                                            href={route('admin.tickets.show', ticket.id)} 
                                                            className="text-blue-600 hover:text-blue-900"
                                                        >
                                                            Visualizar
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                                    Nenhum ticket encontrado para este cliente
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {tickets.data && tickets.data.length > 0 && (
                                <div className="mt-6 flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Mostrando <span className="font-medium">{tickets.from}</span> a <span className="font-medium">{tickets.to}</span> de{' '}
                                        <span className="font-medium">{tickets.total}</span> resultados
                                    </div>
                                    <div className="flex space-x-2">
                                        {tickets.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                                                    link.active
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                                } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                disabled={!link.url}
                                            />
                                        ))}
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