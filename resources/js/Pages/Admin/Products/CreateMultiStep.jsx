import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import LoadingSpinner from '@/Components/LoadingSpinner';
import { useToast } from '@/Components/ToastProvider';
import useFormValidation from '@/Hooks/useFormValidation';
import ValidationFeedback from '@/Components/ValidationFeedback';
import FormProgressIndicator from '@/Components/FormProgressIndicator';
import { useState } from 'react';

export default function AdminProductCreateMultiStep({ auth }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        codigo: '',
        descricao: '',
        categoria: '',
        preco: '',
        ativo: true,
        tags: '',
        observacoes: ''
    });
    
    const { addToast } = useToast();
    const [currentStep, setCurrentStep] = useState(1);

    // Define form steps
    const steps = [
        { title: 'Informações Básicas', step: 1 },
        { title: 'Detalhes Adicionais', step: 2 },
        { title: 'Finalização', step: 3 }
    ];

    // Validation rules for each step
    const validationRulesStep1 = {
        codigo: [
            (value) => !value ? 'Código é obrigatório' : '',
            (value) => value && value.length < 2 ? 'Código deve ter pelo menos 2 caracteres' : ''
        ],
        descricao: [
            (value) => !value ? 'Descrição é obrigatória' : '',
            (value) => value && value.length < 3 ? 'Descrição deve ter pelo menos 3 caracteres' : ''
        ]
    };

    const validationRulesStep2 = {
        categoria: [
            (value) => !value ? 'Categoria é obrigatória' : ''
        ],
        preco: [
            (value) => !value ? 'Preço é obrigatório' : '',
            (value) => value && (isNaN(value) || parseFloat(value) <= 0) ? 'Preço deve ser um número positivo' : ''
        ]
    };

    const validationRulesStep3 = {
        tags: [
            (value) => value && value.length > 100 ? 'Tags devem ter no máximo 100 caracteres' : ''
        ]
    };

    // Initialize validation hooks for each step
    const validationStep1 = useFormValidation(
        { codigo: data.codigo, descricao: data.descricao },
        validationRulesStep1
    );

    const validationStep2 = useFormValidation(
        { categoria: data.categoria, preco: data.preco },
        validationRulesStep2
    );

    const validationStep3 = useFormValidation(
        { tags: data.tags },
        validationRulesStep3
    );

    // Get validation for current step
    const getCurrentStepValidation = () => {
        switch (currentStep) {
            case 1: return validationStep1;
            case 2: return validationStep2;
            case 3: return validationStep3;
            default: return validationStep1;
        }
    };

    const currentValidation = getCurrentStepValidation();

    // Handle field changes with validation
    const handleFieldChangeWithValidation = (fieldName, value) => {
        setData(fieldName, value);
        currentValidation.handleFieldChange(fieldName, value);
    };

    // Handle step navigation
    const goToStep = (step) => {
        // Validate current step before moving
        if (step > currentStep) {
            const isValid = currentValidation.validateAll();
            if (isValid) {
                setCurrentStep(step);
            } else {
                // Mark fields as touched to show errors
                Object.keys(currentValidation.errors).forEach(field => {
                    currentValidation.handleBlur(field);
                });
            }
        } else {
            setCurrentStep(step);
        }
    };

    // Handle next step
    const nextStep = () => {
        const isValid = currentValidation.validateAll();
        if (isValid && currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        } else {
            // Mark fields as touched to show errors
            Object.keys(currentValidation.errors).forEach(field => {
                currentValidation.handleBlur(field);
            });
        }
    };

    // Handle previous step
    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate all steps
        const isStep1Valid = validationStep1.validateAll();
        const isStep2Valid = validationStep2.validateAll();
        const isStep3Valid = validationStep3.validateAll();
        
        if (isStep1Valid && isStep2Valid && isStep3Valid) {
            post(route('admin.products.store'), {
                onSuccess: () => {
                    reset();
                    addToast('Produto criado com sucesso!', 'success');
                    setCurrentStep(1);
                },
                onError: (errors) => {
                    addToast('Erro ao criar o produto. Por favor, verifique os campos e tente novamente.', 'error');
                    console.error('Submit error:', errors);
                }
            });
        } else {
            // Mark all fields as touched to show validation errors
            Object.keys(validationStep1.errors).forEach(field => validationStep1.handleBlur(field));
            Object.keys(validationStep2.errors).forEach(field => validationStep2.handleBlur(field));
            Object.keys(validationStep3.errors).forEach(field => validationStep3.handleBlur(field));
            addToast('Por favor, corrija os erros no formulário antes de enviar.', 'error');
        }
    };

    const breadcrumbs = [
        { label: 'Painel', href: route('admin.dashboard') },
        { label: 'Produtos', href: route('admin.products.index') },
        { label: 'Adicionar Produto (Multi-Step)', href: route('admin.products.create-multi-step') }
    ];

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Adicionar Produto (Multi-Step)</h2>}
            breadcrumbs={breadcrumbs}
        >
            <Head title="Adicionar Produto (Multi-Step)" />

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
                            
                            {/* Progress Indicator */}
                            <FormProgressIndicator 
                                steps={steps} 
                                currentStep={currentStep} 
                                onStepClick={goToStep}
                            />
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Step 1: Informações Básicas */}
                                {currentStep === 1 && (
                                    <div className="space-y-6">
                                        <h4 className="text-md font-medium text-gray-900">Informações Básicas</h4>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Código <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={data.codigo}
                                                onChange={(e) => handleFieldChangeWithValidation('codigo', e.target.value)}
                                                onBlur={() => currentValidation.handleBlur('codigo')}
                                                className={`border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 ${currentValidation.getFieldValidationClass('codigo')}`}
                                                placeholder="Código do produto"
                                            />
                                            {currentValidation.hasFieldError('codigo') && (
                                                <ValidationFeedback 
                                                    type="error" 
                                                    message={currentValidation.errors.codigo} 
                                                />
                                            )}
                                            {!currentValidation.hasFieldError('codigo') && data.codigo && (
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
                                                onChange={(e) => handleFieldChangeWithValidation('descricao', e.target.value)}
                                                onBlur={() => currentValidation.handleBlur('descricao')}
                                                className={`border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 ${currentValidation.getFieldValidationClass('descricao')}`}
                                                placeholder="Descrição do produto"
                                            />
                                            {currentValidation.hasFieldError('descricao') && (
                                                <ValidationFeedback 
                                                    type="error" 
                                                    message={currentValidation.errors.descricao} 
                                                />
                                            )}
                                            {!currentValidation.hasFieldError('descricao') && data.descricao && (
                                                <ValidationFeedback 
                                                    type="success" 
                                                    message="Descrição válida" 
                                                />
                                            )}
                                        </div>
                                        
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                onClick={nextStep}
                                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                            >
                                                Próximo
                                            </button>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Step 2: Detalhes Adicionais */}
                                {currentStep === 2 && (
                                    <div className="space-y-6">
                                        <h4 className="text-md font-medium text-gray-900">Detalhes Adicionais</h4>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Categoria <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={data.categoria}
                                                onChange={(e) => handleFieldChangeWithValidation('categoria', e.target.value)}
                                                onBlur={() => currentValidation.handleBlur('categoria')}
                                                className={`border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 ${currentValidation.getFieldValidationClass('categoria')}`}
                                            >
                                                <option value="">Selecione uma categoria</option>
                                                <option value="eletronicos">Eletrônicos</option>
                                                <option value="moveis">Móveis</option>
                                                <option value="vestuario">Vestuário</option>
                                                <option value="alimentos">Alimentos</option>
                                            </select>
                                            {currentValidation.hasFieldError('categoria') && (
                                                <ValidationFeedback 
                                                    type="error" 
                                                    message={currentValidation.errors.categoria} 
                                                />
                                            )}
                                            {!currentValidation.hasFieldError('categoria') && data.categoria && (
                                                <ValidationFeedback 
                                                    type="success" 
                                                    message="Categoria selecionada" 
                                                />
                                            )}
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Preço <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={data.preco}
                                                onChange={(e) => handleFieldChangeWithValidation('preco', e.target.value)}
                                                onBlur={() => currentValidation.handleBlur('preco')}
                                                className={`border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 ${currentValidation.getFieldValidationClass('preco')}`}
                                                placeholder="0.00"
                                            />
                                            {currentValidation.hasFieldError('preco') && (
                                                <ValidationFeedback 
                                                    type="error" 
                                                    message={currentValidation.errors.preco} 
                                                />
                                            )}
                                            {!currentValidation.hasFieldError('preco') && data.preco && (
                                                <ValidationFeedback 
                                                    type="success" 
                                                    message="Preço válido" 
                                                />
                                            )}
                                        </div>
                                        
                                        <div className="flex justify-between">
                                            <button
                                                type="button"
                                                onClick={prevStep}
                                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                            >
                                                Anterior
                                            </button>
                                            <button
                                                type="button"
                                                onClick={nextStep}
                                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                            >
                                                Próximo
                                            </button>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Step 3: Finalização */}
                                {currentStep === 3 && (
                                    <div className="space-y-6">
                                        <h4 className="text-md font-medium text-gray-900">Finalização</h4>
                                        
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
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Tags
                                            </label>
                                            <input
                                                type="text"
                                                value={data.tags}
                                                onChange={(e) => handleFieldChangeWithValidation('tags', e.target.value)}
                                                onBlur={() => currentValidation.handleBlur('tags')}
                                                className={`border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 ${currentValidation.getFieldValidationClass('tags')}`}
                                                placeholder="Separe as tags por vírgula"
                                            />
                                            {currentValidation.hasFieldError('tags') && (
                                                <ValidationFeedback 
                                                    type="error" 
                                                    message={currentValidation.errors.tags} 
                                                />
                                            )}
                                            {!currentValidation.hasFieldError('tags') && data.tags && (
                                                <ValidationFeedback 
                                                    type="success" 
                                                    message="Tags válidas" 
                                                />
                                            )}
                                            <div className="mt-1 text-sm text-gray-500">
                                                Separe as tags por vírgula (máximo 100 caracteres)
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Observações
                                            </label>
                                            <textarea
                                                value={data.observacoes}
                                                onChange={(e) => setData('observacoes', e.target.value)}
                                                rows="4"
                                                className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Observações adicionais sobre o produto"
                                            />
                                        </div>
                                        
                                        <div className="flex justify-between">
                                            <button
                                                type="button"
                                                onClick={prevStep}
                                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                            >
                                                Anterior
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 flex items-center"
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
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}