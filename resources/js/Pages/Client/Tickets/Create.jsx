import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import useFormValidation from '@/Hooks/useFormValidation';
import ValidationFeedback from '@/Components/ValidationFeedback';
import Tooltip from '@/Components/Tooltip';
import { getBusinessTerm, getTermTooltip } from '@/Utils/userFriendlyTerms';

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

    // Validation rules
    const validationRules = {
        product_id: [
            (value) => !value ? 'Produto é obrigatório' : ''
        ],
        quantidade: [
            (value) => !value ? 'Quantidade é obrigatória' : '',
            (value) => value && (isNaN(value) || parseInt(value) <= 0) ? 'Quantidade deve ser um número positivo' : ''
        ],
        numero_contrato: [
            (value) => !value ? 'Número do contrato é obrigatório' : '',
            (value) => value && value.length < 3 ? 'Número do contrato deve ter pelo menos 3 caracteres' : ''
        ],
        numero_nf: [
            (value) => !value ? 'Número da nota fiscal é obrigatório' : '',
            (value) => value && value.length < 3 ? 'Número da nota fiscal deve ter pelo menos 3 caracteres' : ''
        ],
        numero_serie: [
            (value) => value && value.length < 3 ? 'Número de série deve ter pelo menos 3 caracteres' : ''
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

    const submit = (e) => {
        e.preventDefault();
        
        // Mark all required fields as touched to show validation errors
        Object.keys(validationRules).forEach(field => {
            handleBlur(field);
        });
        
        // Validate before submitting
        if (isValid) {
            post(route('client.tickets.store'), {
                onError: (errors) => {
                    if (errors.client_id) {
                        alert('Erro: Sua conta não está corretamente associada a um cliente. Por favor, entre em contato com o suporte.');
                    }
                },
                onFinish: () => reset(),
            });
        }
    };

    const ticketTerm = 'Solicitação de Devolução';

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Criar Nova {ticketTerm}</h2>}
        >
            <Head title={`Criar Nova ${ticketTerm}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-6">
                                <Link
                                    href={route('client.tickets.index')}
                                    className="text-blue-600 hover:text-blue-900"
                                >
                                    ← Voltar para {ticketTerm}s
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
                                    <InputLabel htmlFor="product_id" value={
                                        <Tooltip content="Selecione o produto que deseja devolver/trocar" position="right">
                                            <span>Produto *</span>
                                        </Tooltip>
                                    } />
                                    <select
                                        id="product_id"
                                        name="product_id"
                                        value={data.product_id}
                                        onChange={(e) => {
                                            setData('product_id', e.target.value);
                                            handleFieldChange('product_id', e.target.value);
                                        }}
                                        onBlur={() => handleBlur('product_id')}
                                        className={`mt-1 block w-full rounded-md border shadow-sm focus:outline-none focus:ring-2 ${getFieldValidationClass('product_id')}`}
                                    >
                                        <option value="">Selecione um produto</option>
                                        {products.map((product) => (
                                            <option key={product.id} value={product.id}>
                                                {product.codigo} - {product.descricao}
                                            </option>
                                        ))}
                                    </select>
                                    {hasFieldError('product_id') && (
                                        <ValidationFeedback 
                                            type="error" 
                                            message={allErrors.product_id} 
                                        />
                                    )}
                                    {!hasFieldError('product_id') && data.product_id && (
                                        <ValidationFeedback 
                                            type="success" 
                                            message="Produto selecionado" 
                                        />
                                    )}
                                </div>

                                <div>
                                    <InputLabel htmlFor="quantidade" value={
                                        <Tooltip content="Quantidade do produto a ser devolvido/trocado" position="right">
                                            <span>Quantidade *</span>
                                        </Tooltip>
                                    } />
                                    <TextInput
                                        id="quantidade"
                                        type="number"
                                        name="quantidade"
                                        value={data.quantidade}
                                        className={`mt-1 block w-full rounded-md border shadow-sm focus:outline-none focus:ring-2 ${getFieldValidationClass('quantidade')}`}
                                        autoComplete="off"
                                        onChange={(e) => {
                                            setData('quantidade', e.target.value);
                                            handleFieldChange('quantidade', e.target.value);
                                        }}
                                        onBlur={() => handleBlur('quantidade')}
                                    />
                                    {hasFieldError('quantidade') && (
                                        <ValidationFeedback 
                                            type="error" 
                                            message={allErrors.quantidade} 
                                        />
                                    )}
                                    {!hasFieldError('quantidade') && data.quantidade && (
                                        <ValidationFeedback 
                                            type="success" 
                                            message="Quantidade válida" 
                                        />
                                    )}
                                </div>

                                <div>
                                    <InputLabel htmlFor="numero_contrato" value={
                                        <Tooltip content={getTermTooltip('numero_contrato')} position="right">
                                            <span>{getBusinessTerm('numero_contrato')} *</span>
                                        </Tooltip>
                                    } />
                                    <TextInput
                                        id="numero_contrato"
                                        type="text"
                                        name="numero_contrato"
                                        value={data.numero_contrato}
                                        className={`mt-1 block w-full rounded-md border shadow-sm focus:outline-none focus:ring-2 ${getFieldValidationClass('numero_contrato')}`}
                                        autoComplete="off"
                                        onChange={(e) => {
                                            setData('numero_contrato', e.target.value);
                                            handleFieldChange('numero_contrato', e.target.value);
                                        }}
                                        onBlur={() => handleBlur('numero_contrato')}
                                    />
                                    {hasFieldError('numero_contrato') && (
                                        <ValidationFeedback 
                                            type="error" 
                                            message={allErrors.numero_contrato} 
                                        />
                                    )}
                                    {!hasFieldError('numero_contrato') && data.numero_contrato && (
                                        <ValidationFeedback 
                                            type="success" 
                                            message="Número do contrato válido" 
                                        />
                                    )}
                                </div>

                                <div>
                                    <InputLabel htmlFor="numero_nf" value={
                                        <Tooltip content={getTermTooltip('numero_nf')} position="right">
                                            <span>{getBusinessTerm('numero_nf')} *</span>
                                        </Tooltip>
                                    } />
                                    <TextInput
                                        id="numero_nf"
                                        type="text"
                                        name="numero_nf"
                                        value={data.numero_nf}
                                        className={`mt-1 block w-full rounded-md border shadow-sm focus:outline-none focus:ring-2 ${getFieldValidationClass('numero_nf')}`}
                                        autoComplete="off"
                                        onChange={(e) => {
                                            setData('numero_nf', e.target.value);
                                            handleFieldChange('numero_nf', e.target.value);
                                        }}
                                        onBlur={() => handleBlur('numero_nf')}
                                    />
                                    {hasFieldError('numero_nf') && (
                                        <ValidationFeedback 
                                            type="error" 
                                            message={allErrors.numero_nf} 
                                        />
                                    )}
                                    {!hasFieldError('numero_nf') && data.numero_nf && (
                                        <ValidationFeedback 
                                            type="success" 
                                            message="Número da nota fiscal válido" 
                                        />
                                    )}
                                </div>

                                <div>
                                    <InputLabel htmlFor="numero_serie" value={
                                        <Tooltip content={getTermTooltip('numero_serie')} position="right">
                                            <span>{getBusinessTerm('numero_serie')} (Opcional)</span>
                                        </Tooltip>
                                    } />
                                    <TextInput
                                        id="numero_serie"
                                        type="text"
                                        name="numero_serie"
                                        value={data.numero_serie}
                                        className={`mt-1 block w-full rounded-md border shadow-sm focus:outline-none focus:ring-2 ${getFieldValidationClass('numero_serie')}`}
                                        autoComplete="off"
                                        onChange={(e) => {
                                            setData('numero_serie', e.target.value);
                                            handleFieldChange('numero_serie', e.target.value);
                                        }}
                                        onBlur={() => handleBlur('numero_serie')}
                                    />
                                    {hasFieldError('numero_serie') && (
                                        <ValidationFeedback 
                                            type="error" 
                                            message={allErrors.numero_serie} 
                                        />
                                    )}
                                    {!hasFieldError('numero_serie') && data.numero_serie && (
                                        <ValidationFeedback 
                                            type="success" 
                                            message="Número de série válido" 
                                        />
                                    )}
                                </div>

                                <div>
                                    <InputLabel htmlFor="descricao" value={
                                        <Tooltip content="Informações adicionais sobre a solicitação" position="right">
                                            <span>Descrição (Opcional)</span>
                                        </Tooltip>
                                    } />
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
                                    <PrimaryButton disabled={processing || !isValid}>Criar {ticketTerm}</PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}