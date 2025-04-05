// Dados de exemplo para o aplicativo
const agendamentos = [];
const horariosPorDia = {
    // Limite de agendamentos por horário
    '09:00': 2,
    '10:00': 2,
    '11:00': 2,
    '13:00': 2,
    '14:00': 2, 
    '15:00': 2,
    '16:00': 2,
    '17:00': 2
};

// Array para armazenar mensagens do chat
const mensagensChat = [];

// Dados do usuário logado
let usuarioLogado = null;

// Respostas automáticas para o chat
const respostasAutomaticas = [
    { pergunta: /horario|horários|hora|funcionamento/i, resposta: "Nosso salão funciona de segunda a sábado, das 9h às 18h." },
    { pergunta: /preço|precos|valor|custo/i, resposta: "Os preços variam conforme o serviço. Corte a partir de R$50, tintura a partir de R$80. Confira todos na aba Serviços." },
    { pergunta: /cancelar|cancelamento/i, resposta: "Para cancelar um agendamento, vá para a seção 'Meus Agendamentos' e clique no botão cancelar." },
    { pergunta: /endereço|localização|onde fica|como chegar/i, resposta: "Estamos localizados na Rua Exemplo, 123 - São Paulo/SP." },
    { pergunta: /pagamento|formas de pagamento|pagar/i, resposta: "Aceitamos dinheiro, cartões de crédito/débito e PIX." },
    { pergunta: /estacionamento/i, resposta: "Sim, temos estacionamento gratuito para clientes." },
    { pergunta: /wifi|internet/i, resposta: "Oferecemos Wi-Fi gratuito para nossos clientes. Solicite a senha na recepção." }
];

// Função para adicionar agendamentos de demonstração
function adicionarAgendamentosDemo() {
    // Verificar se já existem agendamentos
    if (agendamentos.length > 0) {
        return;
    }
    
    // Obter data atual
    const hoje = new Date();
    
    // Criar datas para os próximos dias
    const amanha = new Date(hoje);
    amanha.setDate(hoje.getDate() + 1);
    
    const depoisDeAmanha = new Date(hoje);
    depoisDeAmanha.setDate(hoje.getDate() + 2);
    
    const proximaSemana = new Date(hoje);
    proximaSemana.setDate(hoje.getDate() + 7);
    
    // Formatar datas para ISO string (YYYY-MM-DD)
    const formatarData = (data) => {
        return data.toISOString().split('T')[0];
    };
    
    // Agendamentos de exemplo
    const exemplos = [
        {
            id: 1,
            nome: 'Maria Silva',
            telefone: '(11) 98765-4321',
            servico: 'corte',
            data: formatarData(hoje),
            hora: '14:00',
            observacoes: 'Corte curto estilo bob',
            status: 'confirmado',
            dataCriacao: new Date(hoje.setHours(8, 0, 0)).toISOString(),
            usuarioId: usuarioLogado ? usuarioLogado.id : 1
        },
        {
            id: 2,
            nome: 'João Santos',
            telefone: '(11) 91234-5678',
            servico: 'tintura',
            data: formatarData(amanha),
            hora: '10:00',
            observacoes: 'Tintura loiro platinado',
            status: 'confirmado',
            dataCriacao: new Date(hoje.setHours(9, 30, 0)).toISOString(),
            usuarioId: usuarioLogado ? usuarioLogado.id : 1
        },
        {
            id: 3,
            nome: 'Ana Oliveira',
            telefone: '(11) 99876-5432',
            servico: 'manicure',
            data: formatarData(hoje),
            hora: '16:00',
            observacoes: 'Unhas em gel',
            status: 'concluido',
            dataCriacao: new Date(hoje.setHours(10, 15, 0)).toISOString(),
            usuarioId: usuarioLogado ? usuarioLogado.id : 1
        },
        {
            id: 4,
            nome: 'Carlos Ferreira',
            telefone: '(11) 98765-1234',
            servico: 'escova',
            data: formatarData(depoisDeAmanha),
            hora: '11:00',
            observacoes: '',
            status: 'cancelado',
            dataCriacao: new Date(hoje.setHours(14, 0, 0)).toISOString(),
            usuarioId: usuarioLogado ? usuarioLogado.id : 1
        },
        {
            id: 5,
            nome: 'Fernanda Costa',
            telefone: '(11) 97654-3210',
            servico: 'pedicure',
            data: formatarData(proximaSemana),
            hora: '15:00',
            observacoes: 'Esmalte vermelho',
            status: 'confirmado',
            dataCriacao: new Date(hoje.setHours(16, 45, 0)).toISOString(),
            usuarioId: usuarioLogado ? usuarioLogado.id : 1
        }
    ];
    
    // Adicionar agendamentos de exemplo
    agendamentos.push(...exemplos);
    
    // Salvar no localStorage
    salvarAgendamentos();
}

// Configuração da aplicação
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o usuário está logado
    usuarioLogado = verificarAutenticacao();
    
    // Definir data mínima para hoje
    const dataInput = document.getElementById('data');
    const hoje = new Date();
    const dataFormatada = hoje.toISOString().split('T')[0];
    dataInput.min = dataFormatada;
    dataInput.value = dataFormatada;

    // Atualizar horários disponíveis com base na data selecionada
    atualizarHorariosDisponiveis();

    // Adicionar event listeners
    dataInput.addEventListener('change', atualizarHorariosDisponiveis);
    
    // Form submit
    const form = document.getElementById('agendamento-form');
    form.addEventListener('submit', fazerAgendamento);
    
    // Carregar agendamentos salvos
    carregarAgendamentos();
    
    // Adicionar agendamentos de demonstração se não houver nenhum
    adicionarAgendamentosDemo();
    
    // Configurar navegação
    configurarNavegacao();
    
    // Eventos para filtrar e buscar agendamentos
    document.getElementById('busca-agendamento').addEventListener('input', filtrarAgendamentos);
    document.getElementById('filtro-status').addEventListener('change', filtrarAgendamentos);
    
    // Renderizar calendário
    renderizarCalendario();
    
    // Renderizar lista de agendamentos
    renderizarListaAgendamentos();
    
    // Configurar chat
    configurarChat();
    
    // Carregar mensagens do chat
    carregarMensagensChat();
    
    // Configurar botão de logout
    configurarLogout();
    
    // Atualizar UI com dados do usuário
    atualizarUIDadosUsuario(usuarioLogado);
});

// Função para verificar autenticação
function verificarAutenticacao() {
    const sessao = localStorage.getItem('sessaoUsuario');
    
    if (!sessao) {
        // Se não houver sessão, redirecionar para a página de login
        window.location.href = 'login.html';
        return;
    }
    
    const sessaoObj = JSON.parse(sessao);
    
    // Verificar se a sessão ainda é válida (por exemplo, 7 dias)
    const dataAtual = new Date();
    const dataSessao = new Date(sessaoObj.timestamp);
    const diff = dataAtual - dataSessao;
    const diffDias = diff / (1000 * 60 * 60 * 24);
    
    if (diffDias >= 7 || !sessaoObj.logado) {
        // Se a sessão expirou, redirecionar para a página de login
        localStorage.removeItem('sessaoUsuario');
        window.location.href = 'login.html';
        return;
    }
    
    // Salvar informações do usuário logado
    return sessaoObj;
}

// Função para configurar o botão de logout
function configurarLogout() {
    // Adicionar botão de logout na navegação se não existir
    const nav = document.querySelector('nav ul');
    
    // Verificar se o botão já existe
    if (!document.getElementById('nav-logout')) {
        const logoutItem = document.createElement('li');
        const logoutLink = document.createElement('a');
        logoutLink.href = '#';
        logoutLink.id = 'nav-logout';
        logoutLink.textContent = 'Sair';
        
        logoutItem.appendChild(logoutLink);
        nav.appendChild(logoutItem);
        
        // Adicionar evento de clique ao botão
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            fazerLogout();
        });
    }
}

// Função para fazer logout
function fazerLogout() {
    if (confirm('Tem certeza que deseja sair?')) {
        // Remover sessão do localStorage
        localStorage.removeItem('sessaoUsuario');
        
        // Redirecionar para a página de login
        window.location.href = 'login.html';
    }
}

// Atualizar UI com dados do usuário
function atualizarUIDadosUsuario(usuario) {
    const usuarioInfo = document.getElementById('usuarioInfo');
    const linkAdmin = document.getElementById('linkAdmin');
    
    if (usuario) {
        usuarioInfo.textContent = `Olá, ${usuario.nome}`;
        usuarioInfo.style.display = 'block';
        
        // Mostrar link da área administrativa apenas para administradores
        if (usuario.admin) {
            linkAdmin.style.display = 'block';
        }
        
        // Preencher dados do usuário no formulário
        const nomeInput = document.getElementById('nome');
        const emailInput = document.getElementById('email');
        const telefoneInput = document.getElementById('telefone');
        
        if (nomeInput) nomeInput.value = usuario.nome;
        if (emailInput) emailInput.value = usuario.email;
        if (telefoneInput) telefoneInput.value = usuario.telefone;
    } else {
        usuarioInfo.style.display = 'none';
        linkAdmin.style.display = 'none';
    }
}

// Função para configurar a navegação entre seções
function configurarNavegacao() {
    // Obter elementos de navegação
    const navAgendar = document.getElementById('nav-agendar');
    const navMeusAgendamentos = document.getElementById('nav-meus-agendamentos');
    const navServicos = document.getElementById('nav-servicos');
    const navChat = document.getElementById('nav-chat');
    const navContato = document.getElementById('nav-contato');
    
    // Obter seções
    const secaoAgendar = document.getElementById('secao-agendar');
    const secaoCalendario = document.getElementById('secao-calendario');
    const secaoMeusAgendamentos = document.getElementById('secao-meus-agendamentos');
    const secaoServicos = document.getElementById('secao-servicos');
    const secaoChat = document.getElementById('secao-chat');
    const secaoContato = document.getElementById('secao-contato');
    
    // Função para atualizar navegação ativa
    function atualizarNavAtiva(navAtivo) {
        // Remover classe active de todos os links
        navAgendar.classList.remove('active');
        navMeusAgendamentos.classList.remove('active');
        navServicos.classList.remove('active');
        navChat.classList.remove('active');
        navContato.classList.remove('active');
        
        // Adicionar classe active ao link selecionado
        navAtivo.classList.add('active');
    }
    
    // Função para mostrar seção selecionada
    function mostrarSecao(secao) {
        // Esconder todas as seções
        secaoAgendar.style.display = 'none';
        secaoCalendario.style.display = 'none';
        secaoMeusAgendamentos.style.display = 'none';
        secaoServicos.style.display = 'none';
        secaoChat.style.display = 'none';
        secaoContato.style.display = 'none';
        
        // Ajustar layout do main para visualização de agendamentos
        const main = document.querySelector('main');
        if (secao === secaoMeusAgendamentos) {
            main.style.display = 'block';
        } else if (secao === secaoAgendar) {
            main.style.display = 'grid';
            secaoCalendario.style.display = 'block';
        }
        
        // Mostrar seção selecionada
        secao.style.display = 'block';
        
        // Rolar para o final do chat se estiver na seção de chat
        if (secao === secaoChat) {
            const chatMessages = document.getElementById('chat-messages');
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }
    
    // Adicionar event listeners aos links de navegação
    navAgendar.addEventListener('click', function(e) {
        e.preventDefault();
        atualizarNavAtiva(navAgendar);
        mostrarSecao(secaoAgendar);
    });
    
    navMeusAgendamentos.addEventListener('click', function(e) {
        e.preventDefault();
        atualizarNavAtiva(navMeusAgendamentos);
        mostrarSecao(secaoMeusAgendamentos);
        renderizarListaAgendamentos();
    });
    
    navServicos.addEventListener('click', function(e) {
        e.preventDefault();
        atualizarNavAtiva(navServicos);
        mostrarSecao(secaoServicos);
    });
    
    navChat.addEventListener('click', function(e) {
        e.preventDefault();
        atualizarNavAtiva(navChat);
        mostrarSecao(secaoChat);
    });
    
    navContato.addEventListener('click', function(e) {
        e.preventDefault();
        atualizarNavAtiva(navContato);
        mostrarSecao(secaoContato);
    });
}

// Função para atualizar horários disponíveis com base na data selecionada
function atualizarHorariosDisponiveis() {
    const dataSelecionada = document.getElementById('data').value;
    const horaSelect = document.getElementById('hora');
    
    // Limpar opções atuais exceto a primeira
    while (horaSelect.options.length > 1) {
        horaSelect.remove(1);
    }
    
    // Verificar horários disponíveis para a data selecionada
    const agendamentosNaData = agendamentos.filter(a => a.data === dataSelecionada);
    
    for (const hora in horariosPorDia) {
        const agendamentosNoHorario = agendamentosNaData.filter(a => a.hora === hora);
        const vagasDisponiveis = horariosPorDia[hora] - agendamentosNoHorario.length;
        
        if (vagasDisponiveis > 0) {
            const option = document.createElement('option');
            option.value = hora;
            option.textContent = hora + (vagasDisponiveis < horariosPorDia[hora] ? ` (${vagasDisponiveis} vagas)` : '');
            horaSelect.appendChild(option);
        }
    }
    
    // Se todos os horários estiverem ocupados
    if (horaSelect.options.length === 1) {
        const option = document.createElement('option');
        option.value = "";
        option.textContent = "Sem horários disponíveis";
        option.disabled = true;
        horaSelect.appendChild(option);
    }
}

// Função para fazer agendamento
function fazerAgendamento(event) {
    event.preventDefault();
    
    // Verificar se o usuário está logado
    if (!usuarioLogado) {
        alert('Você precisa estar logado para fazer um agendamento.');
        window.location.href = 'login.html';
        return;
    }
    
    // Obter dados do formulário
    const nome = document.getElementById('nome').value;
    const telefone = document.getElementById('telefone').value;
    const servico = document.getElementById('servico').value;
    const data = document.getElementById('data').value;
    const hora = document.getElementById('hora').value;
    const observacoes = document.getElementById('observacoes').value;
    
    // Validar dados
    if (!nome || !telefone || !servico || !data || !hora) {
        alert('Por favor, preencha todos os campos obrigatórios!');
        return;
    }
    
    // Criar objeto de agendamento
    const novoAgendamento = {
        id: Date.now(),
        nome,
        telefone,
        servico,
        data,
        hora,
        observacoes,
        status: 'confirmado',
        dataCriacao: new Date().toISOString(),
        usuarioId: usuarioLogado.id
    };
    
    // Adicionar ao array de agendamentos
    agendamentos.push(novoAgendamento);
    
    // Salvar no localStorage
    salvarAgendamentos();
    
    // Atualizar UI
    atualizarHorariosDisponiveis();
    renderizarCalendario();
    renderizarListaAgendamentos();
    
    // Limpar formulário
    document.getElementById('agendamento-form').reset();
    document.getElementById('data').value = data;
    
    // Restaurar dados do usuário no formulário
    document.getElementById('nome').value = usuarioLogado.nome;
    document.getElementById('telefone').value = usuarioLogado.telefone;
    
    // Mostrar mensagem de sucesso
    alert('Agendamento realizado com sucesso!');
}

// Função para renderizar lista de agendamentos
function renderizarListaAgendamentos() {
    const listaAgendamentos = document.getElementById('lista-agendamentos');
    const termoBusca = document.getElementById('busca-agendamento').value.toLowerCase();
    const filtroStatus = document.getElementById('filtro-status').value;
    
    // Limpar lista atual
    listaAgendamentos.innerHTML = '';
    
    // Filtrar agendamentos por usuário logado
    let agendamentosFiltrados = agendamentos.filter(a => a.usuarioId === usuarioLogado.id);
    
    // Aplicar filtro de status
    if (filtroStatus !== 'todos') {
        agendamentosFiltrados = agendamentosFiltrados.filter(a => a.status === filtroStatus);
    }
    
    // Aplicar busca por nome
    if (termoBusca) {
        agendamentosFiltrados = agendamentosFiltrados.filter(a => 
            a.nome.toLowerCase().includes(termoBusca) || 
            a.servico.toLowerCase().includes(termoBusca)
        );
    }
    
    // Ordenar por data e hora (mais recentes primeiro)
    agendamentosFiltrados.sort((a, b) => {
        const dataA = new Date(a.data + 'T' + a.hora);
        const dataB = new Date(b.data + 'T' + b.hora);
        return dataB - dataA;
    });
    
    // Verificar se há agendamentos
    if (agendamentosFiltrados.length === 0) {
        const semRegistros = document.createElement('p');
        semRegistros.className = 'sem-registros';
        semRegistros.textContent = 'Nenhum agendamento encontrado.';
        listaAgendamentos.appendChild(semRegistros);
        return;
    }
    
    // Criar cards de agendamentos
    agendamentosFiltrados.forEach(agendamento => {
        const card = document.createElement('div');
        card.className = 'agendamento-card';
        card.dataset.id = agendamento.id;
        
        // Formatar data
        const dataObj = new Date(agendamento.data);
        const dataFormatada = dataObj.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        
        // Mapear nome do serviço
        const servicosMap = {
            'corte': 'Corte de Cabelo',
            'tintura': 'Tintura',
            'escova': 'Escova',
            'manicure': 'Manicure',
            'pedicure': 'Pedicure'
        };
        
        const nomeServico = servicosMap[agendamento.servico] || agendamento.servico;
        
        // Definir classe de status
        const statusClass = `status-${agendamento.status}`;
        
        // Definir texto de status
        const statusTexto = {
            'confirmado': 'Confirmado',
            'cancelado': 'Cancelado',
            'concluido': 'Concluído'
        };
        
        // Criar conteúdo do card
        card.innerHTML = `
            <h3>
                ${nomeServico}
                <span class="status ${statusClass}">${statusTexto[agendamento.status]}</span>
            </h3>
            <p><strong>Cliente:</strong> ${agendamento.nome}</p>
            <p><strong>Telefone:</strong> ${agendamento.telefone}</p>
            <p><strong>Data:</strong> ${dataFormatada} às ${agendamento.hora}</p>
            ${agendamento.observacoes ? `<p><strong>Observações:</strong> ${agendamento.observacoes}</p>` : ''}
        `;
        
        // Adicionar botões de ação apenas para agendamentos confirmados
        if (agendamento.status === 'confirmado') {
            const acoesDiv = document.createElement('div');
            acoesDiv.className = 'acoes-agendamento';
            
            const btnCancelar = document.createElement('button');
            btnCancelar.className = 'btn-cancelar';
            btnCancelar.textContent = 'Cancelar';
            btnCancelar.addEventListener('click', () => {
                cancelarAgendamento(agendamento.id);
            });
            
            const btnConcluir = document.createElement('button');
            btnConcluir.className = 'btn-concluir';
            btnConcluir.textContent = 'Marcar como Concluído';
            btnConcluir.addEventListener('click', () => {
                concluirAgendamento(agendamento.id);
            });
            
            acoesDiv.appendChild(btnCancelar);
            acoesDiv.appendChild(btnConcluir);
            card.appendChild(acoesDiv);
        }
        
        listaAgendamentos.appendChild(card);
    });
}

// Função para filtrar agendamentos
function filtrarAgendamentos() {
    renderizarListaAgendamentos();
}

// Função para cancelar agendamento
function cancelarAgendamento(id) {
    const index = agendamentos.findIndex(a => a.id == id);
    if (index !== -1) {
        if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
            agendamentos[index].status = 'cancelado';
            salvarAgendamentos();
            renderizarListaAgendamentos();
            renderizarCalendario();
        }
    }
}

// Função para concluir agendamento
function concluirAgendamento(id) {
    const index = agendamentos.findIndex(a => a.id == id);
    if (index !== -1) {
        agendamentos[index].status = 'concluido';
        salvarAgendamentos();
        renderizarListaAgendamentos();
        renderizarCalendario();
    }
}

// Função para salvar agendamentos no localStorage
function salvarAgendamentos() {
    localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
}

// Função para carregar agendamentos do localStorage
function carregarAgendamentos() {
    const dados = localStorage.getItem('agendamentos');
    if (dados) {
        agendamentos.length = 0; // Limpar array atual
        agendamentos.push(...JSON.parse(dados));
    }
}

// Função para renderizar o calendário
function renderizarCalendario() {
    const calendarioDiv = document.getElementById('calendario');
    const hoje = new Date();
    const dataSelecionada = document.getElementById('data').value;
    const dataObj = new Date(dataSelecionada);
    
    // Limpar calendário atual
    calendarioDiv.innerHTML = '';
    
    // Criar header do calendário
    const header = document.createElement('div');
    header.className = 'calendario-header';
    
    const titulo = document.createElement('h3');
    titulo.textContent = `${dataObj.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`;
    header.appendChild(titulo);
    
    calendarioDiv.appendChild(header);
    
    // Criar grid dos dias
    const diasGrid = document.createElement('div');
    diasGrid.className = 'dias-grid';
    diasGrid.style.display = 'grid';
    diasGrid.style.gridTemplateColumns = 'repeat(7, 1fr)';
    diasGrid.style.gap = '5px';
    diasGrid.style.marginTop = '10px';
    
    // Nomes dos dias da semana
    const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    diasSemana.forEach(dia => {
        const diaSemanaEl = document.createElement('div');
        diaSemanaEl.textContent = dia;
        diaSemanaEl.style.textAlign = 'center';
        diaSemanaEl.style.fontWeight = 'bold';
        diasGrid.appendChild(diaSemanaEl);
    });
    
    // Pegar o primeiro dia do mês
    const primeiroDia = new Date(dataObj.getFullYear(), dataObj.getMonth(), 1);
    const ultimoDia = new Date(dataObj.getFullYear(), dataObj.getMonth() + 1, 0);
    
    // Adicionar dias vazios até o primeiro dia do mês
    for (let i = 0; i < primeiroDia.getDay(); i++) {
        const diaVazio = document.createElement('div');
        diaVazio.style.padding = '10px';
        diasGrid.appendChild(diaVazio);
    }
    
    // Adicionar todos os dias do mês
    for (let i = 1; i <= ultimoDia.getDate(); i++) {
        const diaEl = document.createElement('div');
        diaEl.textContent = i;
        diaEl.style.padding = '10px';
        diaEl.style.cursor = 'pointer';
        diaEl.style.textAlign = 'center';
        diaEl.style.borderRadius = '5px';
        
        // Data atual sendo construída
        const dataDia = new Date(dataObj.getFullYear(), dataObj.getMonth(), i);
        const dataStr = dataDia.toISOString().split('T')[0];
        
        // Verificar se é a data selecionada
        if (dataStr === dataSelecionada) {
            diaEl.style.backgroundColor = '#8e44ad';
            diaEl.style.color = 'white';
        }
        
        // Verificar se é hoje
        if (dataDia.setHours(0, 0, 0, 0) === hoje.setHours(0, 0, 0, 0)) {
            diaEl.style.border = '2px solid #8e44ad';
        }
        
        // Verificar agendamentos para este dia (apenas do usuário logado)
        const agendamentosNoDia = agendamentos.filter(a => a.data === dataStr && a.usuarioId === usuarioLogado.id);
        if (agendamentosNoDia.length > 0) {
            diaEl.style.backgroundColor = agendamentosNoDia.length > 2 ? '#f39c12' : '#e74c3c';
            diaEl.style.color = 'white';
        }
        
        // Não permitir selecionar dias passados
        if (dataDia < hoje && dataDia.toDateString() !== hoje.toDateString()) {
            diaEl.style.opacity = '0.5';
            diaEl.style.cursor = 'not-allowed';
        } else {
            // Event listener para selecionar data
            diaEl.addEventListener('click', function() {
                document.getElementById('data').value = dataStr;
                atualizarHorariosDisponiveis();
                renderizarCalendario();
            });
        }
        
        diasGrid.appendChild(diaEl);
    }
    
    calendarioDiv.appendChild(diasGrid);
    
    // Adicionar legenda
    const legenda = document.createElement('div');
    legenda.className = 'legenda';
    legenda.style.marginTop = '15px';
    legenda.style.display = 'flex';
    legenda.style.gap = '15px';
    legenda.style.justifyContent = 'center';
    
    const legendaItens = [
        { cor: '#8e44ad', texto: 'Selecionado' },
        { cor: '#e74c3c', texto: 'Seus Agendamentos' },
        { cor: '#f39c12', texto: 'Vários Agendamentos' }
    ];
    
    legendaItens.forEach(item => {
        const legendaItem = document.createElement('div');
        legendaItem.style.display = 'flex';
        legendaItem.style.alignItems = 'center';
        legendaItem.style.gap = '5px';
        
        const cor = document.createElement('div');
        cor.style.width = '15px';
        cor.style.height = '15px';
        cor.style.backgroundColor = item.cor;
        cor.style.borderRadius = '3px';
        
        const texto = document.createElement('span');
        texto.textContent = item.texto;
        
        legendaItem.appendChild(cor);
        legendaItem.appendChild(texto);
        legenda.appendChild(legendaItem);
    });
    
    calendarioDiv.appendChild(legenda);
}

// Função para configurar o chat
function configurarChat() {
    const mensagemInput = document.getElementById('mensagem-input');
    const enviarBtn = document.getElementById('enviar-mensagem');
    
    // Função para enviar mensagem
    function enviarMensagem() {
        const mensagem = mensagemInput.value.trim();
        if (mensagem) {
            // Adicionar mensagem do cliente
            adicionarMensagemAoChat('Cliente', mensagem, 'cliente');
            mensagemInput.value = '';
            
            // Processar resposta automática após um pequeno delay
            setTimeout(() => {
                processarRespostaAutomatica(mensagem);
            }, 1000);
        }
    }
    
    // Evento de clique no botão enviar
    enviarBtn.addEventListener('click', enviarMensagem);
    
    // Evento de tecla Enter no input
    mensagemInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            enviarMensagem();
        }
    });
}

// Função para adicionar mensagem ao chat
function adicionarMensagemAoChat(autor, conteudo, tipo) {
    // Criar objeto de mensagem
    const horario = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const novaMensagem = {
        autor,
        conteudo,
        tipo, // 'cliente' ou 'atendente'
        horario,
        timestamp: new Date().toISOString()
    };
    
    // Adicionar ao array de mensagens
    mensagensChat.push(novaMensagem);
    
    // Salvar no localStorage
    salvarMensagensChat();
    
    // Renderizar mensagem na tela
    renderizarMensagem(novaMensagem);
    
    // Rolar para o final do chat
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Função para renderizar uma mensagem no chat
function renderizarMensagem(mensagem) {
    const chatMessages = document.getElementById('chat-messages');
    
    // Criar elemento de mensagem
    const mensagemEl = document.createElement('div');
    mensagemEl.className = `mensagem mensagem-${mensagem.tipo}`;
    
    // Criar header da mensagem
    const mensagemHeader = document.createElement('div');
    mensagemHeader.className = 'mensagem-header';
    
    // Autor
    const autorEl = document.createElement('span');
    autorEl.className = 'mensagem-autor';
    autorEl.textContent = mensagem.autor;
    
    // Horário
    const horarioEl = document.createElement('span');
    horarioEl.className = 'mensagem-hora';
    horarioEl.textContent = mensagem.horario;
    
    mensagemHeader.appendChild(autorEl);
    mensagemHeader.appendChild(horarioEl);
    
    // Conteúdo da mensagem
    const conteudoEl = document.createElement('div');
    conteudoEl.className = 'mensagem-conteudo';
    conteudoEl.textContent = mensagem.conteudo;
    
    // Montar mensagem
    mensagemEl.appendChild(mensagemHeader);
    mensagemEl.appendChild(conteudoEl);
    
    // Adicionar ao chat
    chatMessages.appendChild(mensagemEl);
}

// Função para processar resposta automática
function processarRespostaAutomatica(mensagem) {
    // Verificar se a mensagem corresponde a alguma resposta automática
    let resposta = "Agradecemos seu contato! Um de nossos atendentes responderá em breve.";
    
    for (const item of respostasAutomaticas) {
        if (item.pergunta.test(mensagem)) {
            resposta = item.resposta;
            break;
        }
    }
    
    // Adicionar resposta automática
    adicionarMensagemAoChat('Atendente', resposta, 'atendente');
}

// Função para salvar mensagens no localStorage
function salvarMensagensChat() {
    localStorage.setItem('mensagensChat', JSON.stringify(mensagensChat));
}

// Função para carregar mensagens do localStorage
function carregarMensagensChat() {
    const dados = localStorage.getItem('mensagensChat');
    
    // Limpar array de mensagens
    mensagensChat.length = 0;
    
    // Se não houver mensagens salvas, adicionar mensagem de boas-vindas
    if (!dados) {
        const boasVindas = {
            autor: 'Atendente',
            conteudo: 'Olá! Como posso ajudar você hoje?',
            tipo: 'atendente',
            horario: '09:00',
            timestamp: new Date().toISOString()
        };
        
        mensagensChat.push(boasVindas);
        salvarMensagensChat();
    } else {
        // Carregar mensagens salvas
        const mensagensSalvas = JSON.parse(dados);
        mensagensChat.push(...mensagensSalvas);
    }
    
    // Renderizar todas as mensagens
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = '';
    
    mensagensChat.forEach(mensagem => {
        renderizarMensagem(mensagem);
    });
} 