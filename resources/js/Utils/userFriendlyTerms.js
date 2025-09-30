// Utility functions to provide user-friendly terms and descriptions

export const getUserFriendlyTicketTerm = (context = 'general') => {
    const terms = {
        general: 'Solicitação',
        client: 'Solicitação de Devolução',
        admin: 'Pedido',
        full: 'Solicitação de Devolução/Troca'
    };
    return terms[context] || terms.general;
};

export const getUserFriendlyStatus = (status) => {
    const statusMap = {
        'aberto': 'Aberto',
        'em_analise': 'Em Análise',
        'aprovado': 'Aprovado',
        'reprovado': 'Reprovado',
        'aguardando_envio': 'Aguardando Envio',
        'em_transito': 'Em Trânsito',
        'recebido': 'Recebido',
        'concluido': 'Concluído',
        'cancelado': 'Cancelado'
    };
    return statusMap[status] || status;
};

export const getStatusDescription = (status) => {
    const descriptions = {
        'aberto': 'Solicitação recebida, aguardando análise',
        'em_analise': 'Nossa equipe está analisando sua solicitação',
        'aprovado': 'Solicitação aprovada, produto será recolhido',
        'reprovado': 'Solicitação não atende aos critérios',
        'aguardando_envio': 'Aguardando envio do produto para troca',
        'em_transito': 'Produto está em transporte para nossa loja',
        'recebido': 'Produto recebido em nosso centro de distribuição',
        'concluido': 'Processo de troca finalizado com sucesso',
        'cancelado': 'Solicitação foi cancelada'
    };
    return descriptions[status] || 'Status da solicitação';
};

// Updated function to get standardized status colors (4 main categories)
export const getStandardizedStatusClass = (status) => {
    // Green for completed/approved states
    if (['aprovado', 'concluido', 'recebido'].includes(status)) {
        return 'bg-green-100 text-green-800';
    }
    // Blue for in-progress/analysis states
    else if (['em_analise', 'aguardando_envio', 'em_transito'].includes(status)) {
        return 'bg-blue-100 text-blue-800';
    }
    // Red for rejected/error states
    else if (['reprovado', 'cancelado'].includes(status)) {
        return 'bg-red-100 text-red-800';
    }
    // Neutral (gray) for pending/inactive states
    else if (['aberto'].includes(status)) {
        return 'bg-gray-100 text-gray-800';
    }
    // Default fallback
    else {
        return 'bg-gray-100 text-gray-800';
    }
};

export const getBusinessTerm = (term) => {
    const businessTerms = {
        'ticket': 'Solicitação de Devolução',
        'cnpj': 'CNPJ (Cadastro Nacional da Pessoa Jurídica)',
        'razao_social': 'Razão Social (Nome oficial da empresa)',
        'numero_contrato': 'Número do Contrato',
        'numero_nf': 'Número da Nota Fiscal',
        'numero_serie': 'Número de Série',
        'email_notificacao': 'E-mail de Notificação'
    };
    return businessTerms[term] || term;
};

export const getTermTooltip = (term) => {
    const tooltips = {
        'cnpj': 'Cadastro Nacional da Pessoa Jurídica - Número de identificação da empresa perante a Receita Federal',
        'razao_social': 'Nome oficial da empresa conforme registro no CNPJ',
        'ticket': 'Solicitação de devolução ou troca de produto',
        'numero_contrato': 'Número do contrato associado à solicitação',
        'numero_nf': 'Número da Nota Fiscal do produto',
        'numero_serie': 'Número de série do produto (opcional)',
        'email_notificacao': 'E-mail para envio de notificações sobre a solicitação',
        'status': 'Situação atual da solicitação',
        'aberto': 'Solicitação recebida, aguardando análise',
        'em_analise': 'Nossa equipe está analisando sua solicitação',
        'aprovado': 'Solicitação aprovada, produto será recolhido',
        'reprovado': 'Solicitação não atende aos critérios',
        'aguardando_envio': 'Aguardando envio do produto para troca',
        'em_transito': 'Produto está em transporte para nossa loja',
        'recebido': 'Produto recebido em nosso centro de distribuição',
        'concluido': 'Processo de troca finalizado com sucesso',
        'cancelado': 'Solicitação foi cancelada'
    };
    return tooltips[term] || '';
};

// New function to get client-related terms
export const getClientTerm = (term) => {
    const clientTerms = {
        'razao_social': 'Razão Social',
        'cnpj': 'CNPJ',
        'email_notificacao': 'E-mail de Notificação',
        'tickets_count': 'Quantidade de Solicitações'
    };
    return clientTerms[term] || term;
};

// New function to get product-related terms
export const getProductTerm = (term) => {
    const productTerms = {
        'codigo': 'Código do Produto',
        'descricao': 'Descrição do Produto',
        'quantidade': 'Quantidade'
    };
    return productTerms[term] || term;
};