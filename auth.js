// Funções de autenticação para o sistema de agendamento

// Verificar se o usuário está logado
function verificarAutenticacao() {
    const sessao = localStorage.getItem('sessaoUsuario');
    
    if (!sessao) {
        // Se não houver sessão, redirecionar para a página de login
        window.location.href = 'login.html';
        return null;
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
        return null;
    }
    
    return sessaoObj;
}

// Configurar o botão de logout
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

// Função para atualizar UI com dados do usuário
function atualizarUIDadosUsuario(usuario) {
    // Verificar se há um usuário
    if (!usuario) return;
    
    // Adicionar nome do usuário no header
    const header = document.querySelector('header');
    
    // Verificar se a div do usuário já existe
    let usuarioInfo = document.querySelector('.usuario-info');
    
    if (!usuarioInfo) {
        usuarioInfo = document.createElement('div');
        usuarioInfo.className = 'usuario-info';
        
        const nomeSpan = document.createElement('span');
        nomeSpan.textContent = `Olá, ${usuario.nome.split(' ')[0]}`;
        
        usuarioInfo.appendChild(nomeSpan);
        header.appendChild(usuarioInfo);
    } else {
        usuarioInfo.querySelector('span').textContent = `Olá, ${usuario.nome.split(' ')[0]}`;
    }
    
    // Tentar preencher campos de agendamento com dados do usuário
    const nomeInput = document.getElementById('nome');
    const telefoneInput = document.getElementById('telefone');
    
    if (nomeInput) nomeInput.value = usuario.nome;
    if (telefoneInput) telefoneInput.value = usuario.telefone;
}

// Função para verificar se o usuário é administrador
function verificarAdmin() {
    const usuario = verificarAutenticacao();
    return usuario && usuario.admin;
}

// Função para criar usuário administrador
function criarAdmin() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    
    // Verificar se já existe um administrador
    if (!usuarios.some(u => u.admin)) {
        const admin = {
            id: 1,
            nome: 'Administrador',
            email: 'admin@salao.com',
            senha: 'admin123',
            admin: true,
            dataCadastro: new Date().toISOString()
        };
        
        usuarios.push(admin);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }
}

// Criar administrador ao carregar a página
document.addEventListener('DOMContentLoaded', criarAdmin); 