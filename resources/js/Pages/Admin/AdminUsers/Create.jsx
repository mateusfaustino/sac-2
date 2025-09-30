import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import LoadingSpinner from '@/Components/LoadingSpinner';
import { useToast } from '@/Components/ToastProvider';

export default function AdminUserCreate({ auth }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    
    const { addToast } = useToast();

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.admin-users.store'), {
            onSuccess: () => {
                reset();
                addToast('Usuário administrador criado com sucesso!', 'success');
            },
            onError: (errors) => {
                addToast('Erro ao criar o usuário administrador. Por favor, verifique os campos e tente novamente.', 'error');
                console.error('Submit error:', errors);
            }
        });
    };

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Adicionar Usuário Admin</h2>}
        >
            <Head title="Adicionar Usuário Admin" />

            <div className="py-4">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium">Novo Usuário Admin</h3>
                                <Link
                                    href={route('admin.admin-users.index')}
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                >
                                    Voltar para lista
                                </Link>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Nome completo"
                                    />
                                    {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">E-mail *</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="exemplo@dominio.com"
                                    />
                                    {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Senha *</label>
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Senha"
                                    />
                                    {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Senha *</label>
                                    <input
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Confirmar senha"
                                    />
                                </div>
                                
                                <div className="flex justify-end space-x-2">
                                    <Link
                                        href={route('admin.admin-users.index')}
                                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                    >
                                        Cancelar
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center"
                                    >
                                        {processing ? (
                                            <>
                                                <LoadingSpinner size="sm" className="mr-2" />
                                                Salvando...
                                            </>
                                        ) : (
                                            'Salvar Usuário'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}