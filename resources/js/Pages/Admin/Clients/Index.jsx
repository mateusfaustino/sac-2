import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import LoadingSpinner from '@/Components/LoadingSpinner';
import { useToast } from '@/Components/ToastProvider';
import { useStatusBar } from '@/Components/StatusBarProvider';
import BackgroundJobService from '@/Services/BackgroundJobService';
import FilterIndicator from '@/Components/FilterIndicator';
import ExportProgressModal from '@/Components/ExportProgressModal';
import Tooltip from '@/Components/Tooltip';
import { getBusinessTerm, getTermTooltip, getClientTerm } from '@/Utils/userFriendlyTerms';

export default function AdminClientsIndex({ auth, clients, filters }) {
    const [searchFilters, setSearchFilters] = useState({
        razao_social: filters?.razao_social || '',
        cnpj: filters?.cnpj || '',
        email_notificacao: filters?.email_notificacao || ''
    });
    const [isExportingExcel, setIsExportingExcel] = useState(false);
    const [isExportingPdf, setIsExportingPdf] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [currentExportJob, setCurrentExportJob] = useState(null);
    const [exportType, setExportType] = useState('');
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

    const breadcrumbs = [
        { label: 'Painel', href: route('admin.dashboard') },
        { label: 'Clientes', href: route('admin.clients.index') }
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
        const url = new URL(route('admin.clients.index'), window.location.origin);
        Object.keys(searchFilters).forEach(key => {
            if (searchFilters[key]) {
                url.searchParams.append(key, searchFilters[key]);
            }
        });
        window.location.href = url.toString();
    };

    const resetFilters = () => {
        setSearchFilters({
            razao_social: '',
            cnpj: '',
            email_notificacao: ''
        });
        window.location.href = route('admin.clients.index');
    };

    const removeFilter = (filterKey) => {
        const newFilters = { ...searchFilters, [filterKey]: '' };
        setSearchFilters(newFilters);
        
        const url = new URL(route('admin.clients.index'), window.location.origin);
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
        setExportType('Excel (Clientes)');
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
                addToast('Exportação de clientes (Excel) concluída com sucesso!', 'success');
            },
            onError: (job) => {
                setShowExportModal(false);
                setIsExportingExcel(false);
                addToast('Erro na exportação de clientes (Excel).', 'error');
            },
            onCancel: (job) => {
                setShowExportModal(false);
                setIsExportingExcel(false);
                addToast('Exportação de clientes (Excel) cancelada.', 'warning');
            }
        });
        
        // Start monitoring the export job
        BackgroundJobService.startExportJob(jobId, 'clientes (Excel)', clients.total);
        
        const url = new URL(route('admin.clients.export', { format: 'excel' }), window.location.origin);
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
                    BackgroundJobService.completeJob(jobId, true, 'Exportação de clientes (Excel) concluída com sucesso!', url.toString());
                    // Trigger download
                    window.location.href = url.toString();
                }, 500);
            }
        }, 300);
    };

    const exportToPDF = () => {
        const jobId = 'export-pdf-' + Date.now();
        setCurrentExportJob(jobId);
        setExportType('PDF (Clientes)');
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
                addToast('Exportação de clientes (PDF) concluída com sucesso!', 'success');
            },
            onError: (job) => {
                setShowExportModal(false);
                setIsExportingPdf(false);
                addToast('Erro na exportação de clientes (PDF).', 'error');
            },
            onCancel: (job) => {
                setShowExportModal(false);
                setIsExportingPdf(false);
                addToast('Exportação de clientes (PDF) cancelada.', 'warning');
            }
        });
        
        // Start monitoring the export job
        BackgroundJobService.startExportJob(jobId, 'clientes (PDF)', clients.total);
        
        const url = new URL(route('admin.clients.export', { format: 'pdf' }), window.location.origin);
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
                    BackgroundJobService.completeJob(jobId, true, 'Exportação de clientes (PDF) concluída com sucesso!', url.toString());
                    // Trigger download
                    window.location.href = url.toString();
                }, 500);
            }
        }, 300);
    };

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
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gerenciamento de Clientes</h2>}
            breadcrumbs={breadcrumbs}
        >
            <Head title="Gerenciamento de Clientes" />

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
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                <h3 className="text-lg font-medium mb-4">Filtros</h3>
                                <form onSubmit={applyFilters} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            <Tooltip content={getTermTooltip('razao_social')} position="right">
                                                <span>{getClientTerm('razao_social')}</span>
                                            </Tooltip>
                                        </label>
                                        <input
                                            type="text"
                                            name="razao_social"
                                            value={searchFilters.razao_social}
                                            onChange={handleFilterChange}
                                            placeholder="Nome da empresa"
                                            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            <Tooltip content={getTermTooltip('cnpj')} position="right">
                                                <span>{getClientTerm('cnpj')}</span>
                                            </Tooltip>
                                        </label>
                                        <input
                                            type="text"
                                            name="cnpj"
                                            value={searchFilters.cnpj}
                                            onChange={handleFilterChange}
                                            placeholder="CNPJ"
                                            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            <Tooltip content={getTermTooltip('email_notificacao')} position="right">
                                                <span>{getClientTerm('email_notificacao')}</span>
                                            </Tooltip>
                                        </label>
                                        <input
                                            type="text"
                                            name="email_notificacao"
                                            value={searchFilters.email_notificacao}
                                            onChange={handleFilterChange}
                                            placeholder="E-mail"
                                            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="md:col-span-2 lg:col-span-3">
                                        <div className="flex space-x-2">
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

                            {/* Filter Indicator */}
                            <FilterIndicator 
                                filters={searchFilters}
                                onClearAll={resetFilters}
                                onRemoveFilter={removeFilter}
                            />

                            {/* Action Buttons */}
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium">Lista de Clientes</h3>
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

                            {/* Clients Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                <Tooltip content={getTermTooltip('razao_social')} position="top">
                                                    <span>{getClientTerm('razao_social')}</span>
                                                </Tooltip>
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                <Tooltip content={getTermTooltip('cnpj')} position="top">
                                                    <span>{getClientTerm('cnpj')}</span>
                                                </Tooltip>
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                <Tooltip content={getTermTooltip('email_notificacao')} position="top">
                                                    <span>{getClientTerm('email_notificacao')}</span>
                                                </Tooltip>
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                <Tooltip content="Quantidade de solicitações criadas pelo cliente" position="top">
                                                    <span>{getClientTerm('tickets_count')}</span>
                                                </Tooltip>
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {clients.data && clients.data.length > 0 ? (
                                            clients.data.map((client) => (
                                                <tr key={client.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {client.razao_social}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {client.cnpj}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {client.email_notificacao || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {client.tickets_count}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <Link 
                                                            href={route('admin.clients.show', client.id)} 
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
                                                    Nenhum cliente encontrado
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {clients.data && clients.data.length > 0 && (
                                <div className="mt-6 flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Mostrando <span className="font-medium">{clients.from}</span> a <span className="font-medium">{clients.to}</span> de{' '}
                                        <span className="font-medium">{clients.total}</span> resultados
                                    </div>
                                    <div className="flex space-x-2">
                                        {clients.links.map((link, index) => (
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