import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import LoadingSpinner from '@/Components/LoadingSpinner';

export default function AdminUsersIndex({ auth, adminUsers, filters }) {
    const [searchFilters, setSearchFilters] = useState({
        name: filters?.name || '',
        email: filters?.email || ''
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setSearchFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const applyFilters = (e) => {
        e.preventDefault();
        const url = new URL(route('admin.admin-users.index'), window.location.origin);
        Object.keys(searchFilters).forEach(key => {
            if (searchFilters[key]) {
                url.searchParams.append(key, searchFilters[key]);
            }
        });
        window.location.href = url.toString();
    };

    const resetFilters = () => {
        setSearchFilters({
            name: '',
            email: ''
        });
        window.location.href = route('admin.admin-users.index');
    };

    const breadcrumbs = [
        { label: 'Painel', href: route('admin.dashboard') },
        { label: 'Usuários Admin', href: route('admin.admin-users.index') }
    ];

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gerenciamento de Usuários Admin</h2>}
            breadcrumbs={breadcrumbs}
        >
            <Head title="Gerenciamento de Usuários Admin" />

            <div className="py-4">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Filter Section */}
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                <h3 className="text-lg font-medium mb-4">Filtros</h3>
                                <form onSubmit={applyFilters} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={searchFilters.name}
                                            onChange={handleFilterChange}
                                            placeholder="Nome do usuário"
                                            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                                        <input
                                            type="text"
                                            name="email"
                                            value={searchFilters.email}
                                            onChange={handleFilterChange}
                                            placeholder="E-mail do usuário"
                                            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="md:col-span-2 lg:col-span-3">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Busca Geral</label>
                                        <div className="flex space-x-2">
                                            <input
                                                type="text"
                                                name="search"
                                                value={searchFilters.search || ''}
                                                onChange={handleFilterChange}
                                                placeholder="Nome ou e-mail do usuário"
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
                                <h3 className="text-lg font-medium">Lista de Usuários Admin</h3>
                                <div className="flex space-x-2">
                                    <Link
                                        href={route('admin.admin-users.create')}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Adicionar Usuário Admin
                                    </Link>
                                </div>
                            </div>

                            {/* Admin Users Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-mail</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Criação</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {adminUsers.data && adminUsers.data.length > 0 ? (
                                            adminUsers.data.map((adminUser) => (
                                                <tr key={adminUser.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {adminUser.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {adminUser.email}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {new Date(adminUser.created_at).toLocaleDateString('pt-BR')}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                                                    Nenhum usuário administrador encontrado
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {adminUsers.data && adminUsers.data.length > 0 && (
                                <div className="mt-6 flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Mostrando <span className="font-medium">{adminUsers.from}</span> a <span className="font-medium">{adminUsers.to}</span> de{' '}
                                        <span className="font-medium">{adminUsers.total}</span> resultados
                                    </div>
                                    <div className="flex space-x-2">
                                        {adminUsers.links.map((link, index) => (
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