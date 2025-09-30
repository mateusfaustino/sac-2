import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import LoadingSpinner from '@/Components/LoadingSpinner';
import { useToast } from '@/Components/ToastProvider';

export default function AdminProductCreate({ auth }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        codigo: '',
        descricao: '',
        ativo: true,
    });
    
    const { addToast } = useToast();

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.products.store'), {
            onSuccess: () => {
                reset();
                addToast('Produto criado com sucesso!', 'success');
            },
            onError: (errors) => {
                addToast('Erro ao criar o produto. Por favor, verifique os campos e tente novamente.', 'error');
                console.error('Submit error:', errors);
            }
        });
    };

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Adicionar Produto</h2>}
        >
            <Head title="Adicionar Produto" />

            <div className="py-4">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium">Novo Produto</h3>
                                <Link
                                    href={route('admin.products.index')}
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                >
                                    Voltar para lista
                                </Link>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Código *</label>
                                    <input
                                        type="text"
                                        value={data.codigo}
                                        onChange={(e) => setData('codigo', e.target.value)}
                                        className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Código do produto"
                                    />
                                    {errors.codigo && <div className="text-red-500 text-sm mt-1">{errors.codigo}</div>}
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
                                    <input
                                        type="text"
                                        value={data.descricao}
                                        onChange={(e) => setData('descricao', e.target.value)}
                                        className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Descrição do produto"
                                    />
                                    {errors.descricao && <div className="text-red-500 text-sm mt-1">{errors.descricao}</div>}
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={data.ativo}
                                            onChange={(e) => setData('ativo', e.target.checked)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label className="ml-2 block text-sm text-gray-900">
                                            Ativo
                                        </label>
                                    </div>
                                </div>
                                
                                <div className="flex justify-end space-x-2">
                                    <Link
                                        href={route('admin.products.index')}
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
                                            'Salvar Produto'
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