import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

export default function CreateTicket({ auth, products }) {
    const { props } = usePage();
    const { flash } = props;
    
    const { data, setData, post, processing, errors, reset } = useForm({
        product_id: '',
        quantidade: '',
        numero_contrato: '',
        numero_nf: '',
        numero_serie: '',
        descricao: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('client.tickets.store'), {
            onError: (errors) => {
                if (errors.client_id) {
                    alert('Erro: Sua conta não está corretamente associada a um cliente. Por favor, entre em contato com o suporte.');
                }
            },
            onFinish: () => reset(),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Criar Novo Ticket</h2>}
        >
            <Head title="Criar Novo Ticket" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-6">
                                <Link
                                    href={route('client.tickets.index')}
                                    className="text-blue-600 hover:text-blue-900"
                                >
                                    ← Voltar para Tickets
                                </Link>
                            </div>

                            {/* Flash message display */}
                            {flash?.error && (
                                <div className="mb-4 rounded-md bg-red-50 p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-red-800">
                                                {flash.error}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="product_id" value="Produto" />
                                    <select
                                        id="product_id"
                                        name="product_id"
                                        value={data.product_id}
                                        onChange={(e) => setData('product_id', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        <option value="">Selecione um produto</option>
                                        {products.map((product) => (
                                            <option key={product.id} value={product.id}>
                                                {product.codigo} - {product.descricao}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.product_id} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="quantidade" value="Quantidade" />
                                    <TextInput
                                        id="quantidade"
                                        type="number"
                                        name="quantidade"
                                        value={data.quantidade}
                                        className="mt-1 block w-full"
                                        autoComplete="off"
                                        onChange={(e) => setData('quantidade', e.target.value)}
                                    />
                                    <InputError message={errors.quantidade} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="numero_contrato" value="Número do Contrato" />
                                    <TextInput
                                        id="numero_contrato"
                                        type="text"
                                        name="numero_contrato"
                                        value={data.numero_contrato}
                                        className="mt-1 block w-full"
                                        autoComplete="off"
                                        onChange={(e) => setData('numero_contrato', e.target.value)}
                                    />
                                    <InputError message={errors.numero_contrato} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="numero_nf" value="Número da Nota Fiscal" />
                                    <TextInput
                                        id="numero_nf"
                                        type="text"
                                        name="numero_nf"
                                        value={data.numero_nf}
                                        className="mt-1 block w-full"
                                        autoComplete="off"
                                        onChange={(e) => setData('numero_nf', e.target.value)}
                                    />
                                    <InputError message={errors.numero_nf} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="numero_serie" value="Número de Série (Opcional)" />
                                    <TextInput
                                        id="numero_serie"
                                        type="text"
                                        name="numero_serie"
                                        value={data.numero_serie}
                                        className="mt-1 block w-full"
                                        autoComplete="off"
                                        onChange={(e) => setData('numero_serie', e.target.value)}
                                    />
                                    <InputError message={errors.numero_serie} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="descricao" value="Descrição (Opcional)" />
                                    <textarea
                                        id="descricao"
                                        name="descricao"
                                        value={data.descricao}
                                        rows="4"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        onChange={(e) => setData('descricao', e.target.value)}
                                    />
                                    <InputError message={errors.descricao} className="mt-2" />
                                </div>

                                <div className="flex items-center gap-4">
                                    <PrimaryButton disabled={processing}>Criar Ticket</PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}