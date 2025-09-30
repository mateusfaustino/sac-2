import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import LoadingSpinner from '@/Components/LoadingSpinner';
import { useToast } from '@/Components/ToastProvider';
import { useStatusBar } from '@/Components/StatusBarProvider';
import BackgroundJobService from '@/Services/BackgroundJobService';

export default function AdminTicketsIndex({ auth, tickets, filters }) {
    const [searchFilters, setSearchFilters] = useState({
        status: filters?.status || '',
        client: filters?.client || '',
        product: filters?.product || '',
        date_from: filters?.date_from || '',
        date_to: filters?.date_to || '',
        search: filters?.search || ''
    });
    const [isExportingExcel, setIsExportingExcel] = useState(false);
    const [isExportingPdf, setIsExportingPdf] = useState(false);
    const { addToast } = useToast();
    const statusBar = useStatusBar();

    useEffect(() => {
        // Initialize background job service
        BackgroundJobService.init(statusBar);
        
        // Cleanup on unmount
        return () => {
            // Any cleanup if needed
        };
    }, [statusBar]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setSearchFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const applyFilters = (e) => {
        e.preventDefault();
        const url = new URL(route('admin.tickets.index'), window.location.origin);
        Object.keys(searchFilters).forEach(key => {
            if (searchFilters[key]) {
                url.searchParams.append(key, searchFilters[key]);
            }
        });
        window.location.href = url.toString();
    };

    const resetFilters = () => {
        setSearchFilters({
            status: '',
            client: '',
            product: '',
            date_from: '',
            date_to: '',
            search: ''
        });
        window.location.href = route('admin.tickets.index');
    };

    const exportToExcel = () => {
        setIsExportingExcel(true);
        const jobId = 'export-excel-' + Date.now();
        
        // Start monitoring the export job
        BackgroundJobService.startExportJob(jobId, 'tickets (Excel)');
        
        const url = new URL(route('admin.tickets.export', { format: 'excel' }), window.location.origin);
        Object.keys(searchFilters).forEach(key => {
            if (searchFilters[key]) {
                url.searchParams.append(key, searchFilters[key]);
            }
        });
        window.location.href = url.toString();
        
        // Simulate progress updates
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            BackgroundJobService.updateJobProgress(jobId, progress);
            
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    BackgroundJobService.completeJob(jobId, true, 'Exportação de tickets (Excel) concluída com sucesso!');
                    setIsExportingExcel(false);
                }, 500);
            }
        }, 300);
    };

    const exportToPDF = () => {
        setIsExportingPdf(true);
        const jobId = 'export-pdf-' + Date.now();
        
        // Start monitoring the export job
        BackgroundJobService.startExportJob(jobId, 'tickets (PDF)');
        
        const url = new URL(route('admin.tickets.export', { format: 'pdf' }), window.location.origin);
        Object.keys(searchFilters).forEach(key => {
            if (searchFilters[key]) {
                url.searchParams.append(key, searchFilters[key]);
            }
        });
        window.location.href = url.toString();
        
        // Simulate progress updates
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            BackgroundJobService.updateJobProgress(jobId, progress);
            
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    BackgroundJobService.completeJob(jobId, true, 'Exportação de tickets (PDF) concluída com sucesso!');
                    setIsExportingPdf(false);
                }, 500);
            }
        }, 300);
    };

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
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gerenciamento de Tickets</h2>}
        >
            <Head title="Gerenciamento de Tickets" />

            <div className="py-4">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Filter Section */}
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                <h3 className="text-lg font-medium mb-4">Filtros</h3>
                                <form onSubmit={applyFilters} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                        <select
                                            name="status"
                                            value={searchFilters.status}
                                            onChange={handleFilterChange}
                                            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Todos</option>
                                            <option value="aberto">Aberto</option>
                                            <option value="em_analise">Em Análise</option>
                                            <option value="aprovado">Aprovado</option>
                                            <option value="reprovado">Reprovado</option>
                                            <option value="aguardando_envio">Aguardando Envio</option>
                                            <option value="em_transito">Em Trânsito</option>
                                            <option value="recebido">Recebido</option>
                                            <option value="concluido">Concluído</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                                        <input
                                            type="text"
                                            name="client"
                                            value={searchFilters.client}
                                            onChange={handleFilterChange}
                                            placeholder="Nome do cliente"
                                            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Produto</label>
                                        <input
                                            type="text"
                                            name="product"
                                            value={searchFilters.product}
                                            onChange={handleFilterChange}
                                            placeholder="Nome do produto"
                                            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
                                        <div className="flex space-x-2">
                                            <input
                                                type="date"
                                                name="date_from"
                                                value={searchFilters.date_from}
                                                onChange={handleFilterChange}
                                                className="border border-gray-300 rounded-md px-2 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <input
                                                type="date"
                                                name="date_to"
                                                value={searchFilters.date_to}
                                                onChange={handleFilterChange}
                                                className="border border-gray-300 rounded-md px-2 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 lg:col-span-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Busca Geral</label>
                                        <div className="flex space-x-2">
                                            <input
                                                type="text"
                                                name="search"
                                                value={searchFilters.search}
                                                onChange={handleFilterChange}
                                                placeholder="Número do ticket, CNPJ, etc."
                                                className="border border-gray-300 rounded-md px-3 py-2 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <button
                                                type="submit"
                                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                            >
                                                Filtrar
                                            </button>
                                            <button
                                                type="button"
                                                onClick={resetFilters}
                                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                            >
                                                Limpar
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium">Lista de Tickets</h3>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={exportToExcel}
                                        disabled={isExportingExcel}
                                        className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center ${
                                            isExportingExcel
                                                ? 'bg-green-400 cursor-not-allowed'
                                                : 'bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white'
                                        }`}
                                    >
                                        {isExportingExcel ? (
                                            <>
                                                <LoadingSpinner size="sm" className="mr-2" />
                                                Exportando...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                                </svg>
                                                Exportar Excel
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={exportToPDF}
                                        disabled={isExportingPdf}
                                        className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center ${
                                            isExportingPdf
                                                ? 'bg-red-400 cursor-not-allowed'
                                                : 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white'
                                        }`}
                                    >
                                        {isExportingPdf ? (
                                            <>
                                                <LoadingSpinner size="sm" className="mr-2" />
                                                Exportando...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                                </svg>
                                                Exportar PDF
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Tickets Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
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
                                                        {ticket.client?.razao_social || 'N/A'}
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
                                                        <a 
                                                            href={route('admin.tickets.show', ticket.id)} 
                                                            className="text-blue-600 hover:text-blue-900"
                                                        >
                                                            Visualizar
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                                    Nenhum ticket encontrado
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
                                            <a
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