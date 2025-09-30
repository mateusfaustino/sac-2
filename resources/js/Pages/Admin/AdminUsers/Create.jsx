import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import LoadingSpinner from '@/Components/LoadingSpinner';
import { useToast } from '@/Components/ToastProvider';
import useFormValidation from '@/Hooks/useFormValidation';
import ValidationFeedback from '@/Components/ValidationFeedback';

export default function AdminUserCreate({ auth }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    
    const { addToast } = useToast();

    // Validation rules
    const validationRules = {
        name: [
            (value) => !value ? 'Nome é obrigatório' : '',
            (value) => value && value.length < 2 ? 'Nome deve ter pelo menos 2 caracteres' : ''
        ],
        email: [
            (value) => !value ? 'E-mail é obrigatório' : '',
            (value) => value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'E-mail inválido' : ''
        ],
        password: [
            (value) => !value ? 'Senha é obrigatória' : '',
            (value) => value && value.length < 8 ? 'Senha deve ter pelo menos 8 caracteres' : '',
            (value, formData) => value && formData.password_confirmation && value !== formData.password_confirmation ? 'As senhas não coincidem' : ''
        ],
        password_confirmation: [
            (value) => !value ? 'Confirmação de senha é obrigatória' : '',
            (value, formData) => value && formData.password && value !== formData.password ? 'As senhas não coincidem' : ''
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
        }
    };

    const breadcrumbs = [
        { label: 'Painel', href: route('admin.dashboard') },
        { label: 'Usuários Admin', href: route('admin.admin-users.index') },
        { label: 'Adicionar Usuário Admin', href: route('admin.admin-users.create') }
    ];

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Adicionar Usuário Admin</h2>}
            breadcrumbs={breadcrumbs}
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nome <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => {
                                            setData('name', e.target.value);
                                            handleFieldChange('name', e.target.value);
                                        }}
                                        onBlur={() => handleBlur('name')}
                                        className={`border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 ${getFieldValidationClass('name')}`}
                                        placeholder="Nome completo"
                                    />
                                    {hasFieldError('name') && (
                                        <ValidationFeedback 
                                            type="error" 
                                            message={allErrors.name} 
                                        />
                                    )}
                                    {!hasFieldError('name') && data.name && (
                                        <ValidationFeedback 
                                            type="success" 
                                            message="Nome válido" 
                                        />
                                    )}
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        E-mail <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => {
                                            setData('email', e.target.value);
                                            handleFieldChange('email', e.target.value);
                                        }}
                                        onBlur={() => handleBlur('email')}
                                        className={`border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 ${getFieldValidationClass('email')}`}
                                        placeholder="exemplo@dominio.com"
                                    />
                                    {hasFieldError('email') && (
                                        <ValidationFeedback 
                                            type="error" 
                                            message={allErrors.email} 
                                        />
                                    )}
                                    {!hasFieldError('email') && data.email && (
                                        <ValidationFeedback 
                                            type="success" 
                                            message="E-mail válido" 
                                        />
                                    )}
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Senha <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => {
                                            setData('password', e.target.value);
                                            handleFieldChange('password', e.target.value);
                                        }}
                                        onBlur={() => handleBlur('password')}
                                        className={`border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 ${getFieldValidationClass('password')}`}
                                        placeholder="Senha"
                                    />
                                    {hasFieldError('password') && (
                                        <ValidationFeedback 
                                            type="error" 
                                            message={allErrors.password} 
                                        />
                                    )}
                                    {!hasFieldError('password') && data.password && (
                                        <ValidationFeedback 
                                            type="success" 
                                            message="Senha válida" 
                                        />
                                    )}
                                    <div className="mt-2 text-sm text-gray-500">
                                        A senha deve ter pelo menos 8 caracteres
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Confirmar Senha <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => {
                                            setData('password_confirmation', e.target.value);
                                            handleFieldChange('password_confirmation', e.target.value);
                                        }}
                                        onBlur={() => handleBlur('password_confirmation')}
                                        className={`border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 ${getFieldValidationClass('password_confirmation')}`}
                                        placeholder="Confirmar senha"
                                    />
                                    {hasFieldError('password_confirmation') && (
                                        <ValidationFeedback 
                                            type="error" 
                                            message={allErrors.password_confirmation} 
                                        />
                                    )}
                                    {!hasFieldError('password_confirmation') && data.password_confirmation && (
                                        <ValidationFeedback 
                                            type="success" 
                                            message="Confirmação de senha válida" 
                                        />
                                    )}
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