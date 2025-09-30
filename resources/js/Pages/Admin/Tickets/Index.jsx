import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import LoadingSpinner from '@/Components/LoadingSpinner';
import { useToast } from '@/Components/ToastProvider';
import { useStatusBar } from '@/Components/StatusBarProvider';
import BackgroundJobService from '@/Services/BackgroundJobService';
import FilterIndicator from '@/Components/FilterIndicator';
import LoadingIndicator from '@/Components/LoadingIndicator';
import usePagination from '@/Hooks/usePagination';
import ExportProgressModal from '@/Components/ExportProgressModal';
import Tooltip from '@/Components/Tooltip';
import CollapsibleFilterPanel from '@/Components/CollapsibleFilterPanel';
import { getUserFriendlyTicketTerm, getUserFriendlyStatus, getStatusDescription, getStandardizedStatusClass } from '@/Utils/userFriendlyTerms';

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
    const [showExportModal, setShowExportModal] = useState(false);
    const [currentExportJob, setCurrentExportJob] = useState(null);
    const [exportType, setExportType] = useState('');
    const { data, loading, loadingPage, estimatedTime, goToPage, setData } = usePagination({ tickets });
    const { addToast } = useToast();
    const statusBar = useStatusBar();

    useEffect(() => {
        // Initialize background job service
        BackgroundJobService.init(statusBar);
        
        // Set initial data
        if (tickets) {
            setData({ tickets });
        }
        
        // Cleanup on unmount
        return () => {
            // Any cleanup if needed
        };
    }, [tickets, statusBar]);

    const breadcrumbs = [
        { label: 'Painel', href: route('admin.dashboard') },
        { label: 'Tickets', href: route('admin.tickets.index') }
    ];

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

    const removeFilter = (filterKey) => {
        const newFilters = { ...searchFilters, [filterKey]: '' };
        setSearchFilters(newFilters);
        
        const url = new URL(route('admin.tickets.index'), window.location.origin);
        Object.keys(newFilters).forEach(key => {
            if (newFilters[key]) {
                url.searchParams.append(key, newFilters[key]);
            }
        });
        window.location.href = url.toString();
    };

    const exportToExcel = () => {
        const jobId = 'export-excel-' + Date.now();
        setCurrentExportJob(jobId);
        setExportType('Excel (Tickets)');
        setShowExportModal(true);
        setIsExportingExcel(true);
        
        // Register callbacks for this job
        BackgroundJobService.registerJobCallbacks(jobId, {
            onStart: () => {
                // Start processing
            },
            onProgress: (job) => {
                // Update progress if needed
            },
            onComplete: (job) => {
                setShowExportModal(false);
                setIsExportingExcel(false);
                addToast('Exportação de tickets (Excel) concluída com sucesso!', 'success');
            },
            onError: (job) => {
                setShowExportModal(false);
                setIsExportingExcel(false);
                addToast('Erro na exportação de tickets (Excel).', 'error');
            },
            onCancel: (job) => {
                setShowExportModal(false);
                setIsExportingExcel(false);
                addToast('Exportação de tickets (Excel) cancelada.', 'warning');
            }
        });
        
        // Start monitoring the export job
        BackgroundJobService.startExportJob(jobId, 'tickets (Excel)', tickets.total);
        
        const url = new URL(route('admin.tickets.export', { format: 'excel' }), window.location.origin);
        Object.keys(searchFilters).forEach(key => {
            if (searchFilters[key]) {
                url.searchParams.append(key, searchFilters[key]);
            }
        });
        
        // Simulate progress updates
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            BackgroundJobService.updateJobProgress(jobId, progress);
            
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    BackgroundJobService.completeJob(jobId, true, 'Exportação de tickets (Excel) concluída com sucesso!', url.toString());
                    // Trigger download
                    window.location.href = url.toString();
                }, 500);
            }
        }, 300);
    };

    const exportToPDF = () => {
        const jobId = 'export-pdf-' + Date.now();
        setCurrentExportJob(jobId);
        setExportType('PDF (Tickets)');
        setShowExportModal(true);
        setIsExportingPdf(true);
        
        // Register callbacks for this job
        BackgroundJobService.registerJobCallbacks(jobId, {
            onStart: () => {
                // Start processing
            },
            onProgress: (job) => {
                // Update progress if needed
            },
            onComplete: (job) => {
                setShowExportModal(false);
                setIsExportingPdf(false);
                addToast('Exportação de tickets (PDF) concluída com sucesso!', 'success');
            },
            onError: (job) => {
                setShowExportModal(false);
                setIsExportingPdf(false);
                addToast('Erro na exportação de tickets (PDF).', 'error');
            },
            onCancel: (job) => {
                setShowExportModal(false);
                setIsExportingPdf(false);
                addToast('Exportação de tickets (PDF) cancelada.', 'warning');
            }
        });
        
        // Start monitoring the export job
        BackgroundJobService.startExportJob(jobId, 'tickets (PDF)', tickets.total);
        
        const url = new URL(route('admin.tickets.export', { format: 'pdf' }), window.location.origin);
        Object.keys(searchFilters).forEach(key => {
            if (searchFilters[key]) {
                url.searchParams.append(key, searchFilters[key]);
            }
        });
        
        // Simulate progress updates
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            BackgroundJobService.updateJobProgress(jobId, progress);
            
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    BackgroundJobService.completeJob(jobId, true, 'Exportação de tickets (PDF) concluída com sucesso!', url.toString());
                    // Trigger download
                    window.location.href = url.toString();
                }, 500);
            }
        }, 300);
    };

    const getStatusBadgeClass = (status) => {
        return getStandardizedStatusClass(status);
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

    // Handle pagination click
    const handlePaginationClick = (e, url) => {
        e.preventDefault();
        if (url && !loading) {
            goToPage(url);
        }
    };

    // Get current tickets data
    const currentTickets = data?.tickets || tickets;
    
    const ticketTerm = getUserFriendlyTicketTerm('admin');

    const handleExportDownload = () => {
        // The download is triggered automatically when the job completes
        // This is just for the UI callback
    };

    const handleExportCancel = () => {
        // In a real implementation, you would cancel the export job
        // For now, we'll just close the modal
        setShowExportModal(false);
        setIsExportingExcel(false);
        setIsExportingPdf(false);
    };

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gerenciamento de {ticketTerm}s</h2>}
            breadcrumbs={breadcrumbs}
        >
            <Head title={`Gerenciamento de ${ticketTerm}s`} />

            {/* Export Progress Modal */}
            <ExportProgressModal
                show={showExportModal}
                jobId={currentExportJob}
                type={exportType}
                onClose={() => setShowExportModal(false)}
                onDownload={handleExportDownload}
                onCancel={handleExportCancel}
            />

            <div className="py-4">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Filter Section */}
                            <CollapsibleFilterPanel title="Filtros">
                                <form onSubmit={applyFilters} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            <Tooltip content="Filtrar por status da solicitação" position="right">
                                                <span>Status</span>
                                            </Tooltip>
                                        </label>
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
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            <Tooltip content="Filtrar por nome do cliente" position="right">
                                                <span>Cliente</span>
                                            </Tooltip>
                                        </label>
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
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            <Tooltip content="Filtrar por nome do produto" position="right">
                                                <span>Produto</span>
                                            </Tooltip>
                                        </label>
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
                            </CollapsibleFilterPanel>

                            {/* Filter Indicator */}
                            <FilterIndicator 
                                filters={searchFilters}
                                onClearAll={resetFilters}
                                onRemoveFilter={removeFilter}
                            />

                            {/* Action Buttons */}
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium">Lista de {ticketTerm}s</h3>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={exportToExcel}
                                        disabled={isExportingExcel || isExportingPdf}
                                        className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center ${
                                            isExportingExcel || isExportingPdf
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
                                        disabled={isExportingPdf || isExportingExcel}
                                        className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center ${
                                            isExportingPdf || isExportingExcel
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

                            {/* Loading Indicator */}
                            {loading && (
                                <LoadingIndicator 
                                    message="Carregando página..." 
                                    showEstimatedTime={true}
                                    estimatedTime={estimatedTime}
                                />
                            )}

                            {/* Tickets Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="pb-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                                <Tooltip content={`Número da ${ticketTerm.toLowerCase()}`} position="top">
                                                    <span>{ticketTerm}</span>
                                                </Tooltip>
                                            </th>
                                            <th className="pb-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                                            <th className="pb-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                                            <th className="pb-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                                <Tooltip content="Situação atual da solicitação" position="top">
                                                    <span>Status</span>
                                                </Tooltip>
                                            </th>
                                            <th className="pb-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Data</th>
                                            <th className="pb-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {!loading && currentTickets.data && currentTickets.data.length > 0 ? (
                                            currentTickets.data.map((ticket) => (
                                                <tr key={ticket.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
                                                    <td className="py-4 text-sm font-medium text-gray-900">
                                                        {ticket.ticket_number}
                                                    </td>
                                                    <td className="py-4 text-sm text-gray-900">
                                                        {ticket.client?.razao_social || 'N/A'}
                                                    </td>
                                                    <td className="py-4 text-sm text-gray-900">
                                                        {ticket.items && ticket.items.length > 0 
                                                            ? ticket.items.map(item => item.product?.descricao).join(', ') 
                                                            : 'N/A'}
                                                    </td>
                                                    <td className="py-4">
                                                        <Tooltip 
                                                            content={getStatusDescription(ticket.status)}
                                                            position="top"
                                                        >
                                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(ticket.status)}`}>
                                                                {getUserFriendlyStatus(ticket.status)}
                                                            </span>
                                                        </Tooltip>
                                                    </td>
                                                    <td className="py-4 text-sm text-gray-900">
                                                        {new Date(ticket.created_at).toLocaleDateString('pt-BR')}
                                                    </td>
                                                    <td className="py-4 text-sm font-medium">
                                                        <a 
                                                            href={route('admin.tickets.show', ticket.id)} 
                                                            className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                                                        >
                                                            Visualizar
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : !loading ? (
                                            <tr>
                                                <td colSpan="6" className="py-8 text-center text-sm text-gray-500">
                                                    Nenhum {ticketTerm.toLowerCase()} encontrado
                                                </td>
                                            </tr>
                                        ) : null}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {!loading && currentTickets.data && currentTickets.data.length > 0 && (
                                <div className="mt-8 flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Mostrando <span className="font-medium">{currentTickets.from}</span> a <span className="font-medium">{currentTickets.to}</span> de{' '}
                                        <span className="font-medium">{currentTickets.total}</span> resultados
                                    </div>
                                    <div className="flex space-x-2">
                                        {currentTickets.links.map((link, index) => (
                                            <a
                                                key={index}
                                                href={link.url || '#'}
                                                onClick={(e) => handlePaginationClick(e, link.url)}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                                                    link.active
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                                } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''} ${loadingPage ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                disabled={!link.url || loadingPage}
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