import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

export default function AdminDashboard({ auth, stats }) {
    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Painel do Administrador</h2>}
        >
            <Head title="Painel do Administrador" />

            <div className="py-4">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="text-2xl font-bold text-gray-900">{stats.total_tickets}</div>
                                    <div className="ml-2 text-sm text-gray-500">Total de Tickets</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="text-2xl font-bold text-yellow-600">{stats.open_tickets}</div>
                                    <div className="ml-2 text-sm text-gray-500">Abertos</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="text-2xl font-bold text-blue-600">{stats.in_analysis_tickets}</div>
                                    <div className="ml-2 text-sm text-gray-500">Em Análise</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="text-2xl font-bold text-green-600">{stats.approved_tickets}</div>
                                    <div className="ml-2 text-sm text-gray-500">Aprovados</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium mb-4">Tickets Recentes</h3>
                            
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <a 
                                        href={route('admin.tickets.index')} 
                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    >
                                        Ver Todos os Tickets
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}