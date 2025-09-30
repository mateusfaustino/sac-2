import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import LoadingSpinner from '@/Components/LoadingSpinner';
import { useToast } from '@/Components/ToastProvider';
import useFormValidation from '@/Hooks/useFormValidation';
import ValidationFeedback from '@/Components/ValidationFeedback';

export default function AdminProductCreate({ auth }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        codigo: '',
        descricao: '',
        ativo: true,
    });
    
    const { addToast } = useToast();

    // Validation rules
    const validationRules = {
        codigo: [
            (value) => !value ? 'Código é obrigatório' : '',
            (value) => value && value.length < 2 ? 'Código deve ter pelo menos 2 caracteres' : ''
        ],
        descricao: [
            (value) => !value ? 'Descrição é obrigatória' : '',
            (value) => value && value.length < 3 ? 'Descrição deve ter pelo menos 3 caracteres' : ''
        ]
    };

    // Initialize validation hook
    const {
        errors: validationErrors,
        touched,
        isValid,
        handleBlur,
        handleFieldChange,
        getFieldValidationClass,
        hasFieldError
    } = useFormValidation(data, validationRules);

    // Merge server errors with validation errors
    const allErrors = { ...errors, ...validationErrors };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Mark all fields as touched to show validation errors
        Object.keys(validationRules).forEach(field => {
            handleBlur(field);
        });
        
        // Validate before submitting
        if (isValid) {
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
        }
    };

    const breadcrumbs = [
        { label: 'Painel', href: route('admin.dashboard') },
        { label: 'Produtos', href: route('admin.products.index') },
        { label: 'Adicionar Produto', href: route('admin.products.create') }
    ];

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Adicionar Produto</h2>}
            breadcrumbs={breadcrumbs}
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Código <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.codigo}
                                        onChange={(e) => {
                                            setData('codigo', e.target.value);
                                            handleFieldChange('codigo', e.target.value);
                                        }}
                                        onBlur={() => handleBlur('codigo')}
                                        className={`border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 ${getFieldValidationClass('codigo')}`}
                                        placeholder="Código do produto"
                                    />
                                    {hasFieldError('codigo') && (
                                        <ValidationFeedback 
                                            type="error" 
                                            message={allErrors.codigo} 
                                        />
                                    )}
                                    {!hasFieldError('codigo') && data.codigo && (
                                        <ValidationFeedback 
                                            type="success" 
                                            message="Código válido" 
                                        />
                                    )}
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Descrição <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.descricao}
                                        onChange={(e) => {
                                            setData('descricao', e.target.value);
                                            handleFieldChange('descricao', e.target.value);
                                        }}
                                        onBlur={() => handleBlur('descricao')}
                                        className={`border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 ${getFieldValidationClass('descricao')}`}
                                        placeholder="Descrição do produto"
                                    />
                                    {hasFieldError('descricao') && (
                                        <ValidationFeedback 
                                            type="error" 
                                            message={allErrors.descricao} 
                                        />
                                    )}
                                    {!hasFieldError('descricao') && data.descricao && (
                                        <ValidationFeedback 
                                            type="success" 
                                            message="Descrição válida" 
                                        />
                                    )}
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
                                        disabled={processing || !isValid}
                                        className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center ${
                                            processing || !isValid
                                                ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                                                : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white'
                                        }`}
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