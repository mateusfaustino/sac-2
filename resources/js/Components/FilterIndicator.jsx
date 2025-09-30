import React from 'react';

const FilterTag = ({ label, value, onRemove }) => (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mr-2 mb-2">
        <span className="mr-1">
            <span className="font-medium">{label}:</span> {value}
        </span>
        <button
            type="button"
            className="ml-1 inline-flex items-center rounded-full bg-blue-200 text-blue-800 hover:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={onRemove}
        >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    </span>
);

const FilterIndicator = ({ filters, onClearAll, onRemoveFilter }) => {
    // Check if any filters are active
    const hasActiveFilters = Object.values(filters).some(value => value !== '' && value !== null && value !== undefined);

    if (!hasActiveFilters) {
        return null;
    }

    // Get active filters as an array of { key, label, value } objects
    const activeFilters = Object.entries(filters)
        .filter(([key, value]) => value !== '' && value !== null && value !== undefined)
        .map(([key, value]) => {
            let label = key;
            let displayValue = value;

            // Map filter keys to user-friendly labels
            const labelMap = {
                'status': 'Status',
                'client': 'Cliente',
                'product': 'Produto',
                'date_from': 'Data Inicial',
                'date_to': 'Data Final',
                'search': 'Busca Geral',
                'codigo': 'Código',
                'descricao': 'Descrição',
                'razao_social': 'Razão Social',
                'cnpj': 'CNPJ',
                'email_notificacao': 'E-mail',
                'name': 'Nome',
                'email': 'E-mail'
            };

            if (labelMap[key]) {
                label = labelMap[key];
            }

            // Format date values
            if (key === 'date_from' || key === 'date_to') {
                displayValue = new Date(value).toLocaleDateString('pt-BR');
            }

            // Format status values
            if (key === 'status') {
                const statusMap = {
                    'aberto': 'Aberto',
                    'em_analise': 'Em Análise',
                    'aprovado': 'Aprovado',
                    'reprovado': 'Reprovado',
                    'aguardando_envio': 'Aguardando Envio',
                    'em_transito': 'Em Trânsito',
                    'recebido': 'Recebido',
                    'concluido': 'Concluído',
                    'ativo': 'Ativo',
                    'inativo': 'Inativo'
                };
                if (statusMap[value]) {
                    displayValue = statusMap[value];
                }
            }

            return { key, label, value: displayValue };
        });

    return (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex flex-wrap items-center justify-between">
                <div className="flex items-center mb-2 md:mb-0">
                    <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    <h3 className="text-lg font-medium text-blue-800">Resultados Filtrados</h3>
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-200 text-blue-800">
                        {activeFilters.length} filtro(s) ativo(s)
                    </span>
                </div>
                <button
                    type="button"
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    onClick={onClearAll}
                >
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Limpar Todos
                </button>
            </div>
            
            <div className="mt-3 flex flex-wrap">
                {activeFilters.map((filter) => (
                    <FilterTag
                        key={filter.key}
                        label={filter.label}
                        value={filter.value}
                        onRemove={() => onRemoveFilter(filter.key)}
                    />
                ))}
            </div>
        </div>
    );
};

export default FilterIndicator;