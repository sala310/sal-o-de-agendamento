// Array para armazenar usuários
let usuarios = [];

// Verificar se já existem usuários salvos
document.addEventListener('DOMContentLoaded', function() {
    // Carregar usuários do localStorage
    carregarUsuarios();
    
    // Adicionar usuário padrão se não existir nenhum
    if (usuarios.length === 0) {
        adicionarUsuarioPadrao();
    }
    
    // Configurar abas de login e cadastro
    configurarAbas();
    
    // Configurar eventos do formulário
    configurarFormularios();
    
    // Configurar modal de termos
    configurarModal();
    
    // Verificar se o usuário está logado (lembrar-me)
    verificarSessao();
});

// Função para adicionar usuário padrão
function adicionarUsuarioPadrao() {
    const usuarioPadrao = {
        id: 1,
        nome: 'Usuário Teste',
        email: 'teste@exemplo.com',
        telefone: '(11) 99999-9999',
        senha: '123456',
        dataCadastro: new Date().toISOString()
    };
    
    usuarios.push(usuarioPadrao);
    salvarUsuarios();
}

// Função para configurar as abas
function configurarAbas() {
    const loginTab = document.getElementById('login-tab');
    const cadastroTab = document.getElementById('cadastro-tab');
    const loginForm = document.getElementById('login-form');
    const cadastroForm = document.getElementById('cadastro-form');
    
    // Event listener para a aba de login
    loginTab.addEventListener('click', function() {
        loginTab.classList.add('active');
        cadastroTab.classList.remove('active');
        loginForm.style.display = 'block';
        cadastroForm.style.display = 'none';
    });
    
    // Event listener para a aba de cadastro
    cadastroTab.addEventListener('click', function() {
        cadastroTab.classList.add('active');
        loginTab.classList.remove('active');
        cadastroForm.style.display = 'block';
        loginForm.style.display = 'none';
    });
}

// Função para configurar formulários
function configurarFormularios() {
    const loginForm = document.getElementById('login-form');
    const cadastroForm = document.getElementById('cadastro-form');
    const recuperarSenha = document.getElementById('recuperar-senha');
    
    // Evento de submit do formulário de login
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obter valores dos campos
        const email = document.getElementById('login-email').value;
        const senha = document.getElementById('login-senha').value;
        const lembrar = document.getElementById('lembrar').checked;
        
        // Autenticar usuário
        const autenticado = autenticarUsuario(email, senha);
        
        if (autenticado) {
            // Salvar sessão se a opção "lembrar-me" estiver marcada
            if (lembrar) {
                const usuario = usuarios.find(u => u.email === email);
                salvarSessao(usuario);
            }
            
            // Redirecionar para a página principal
            window.location.href = 'index.html';
        } else {
            alert('Email ou senha incorretos. Tente novamente.');
        }
    });
    
    // Evento de submit do formulário de cadastro
    cadastroForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obter valores dos campos
        const nome = document.getElementById('cadastro-nome').value;
        const email = document.getElementById('cadastro-email').value;
        const telefone = document.getElementById('cadastro-telefone').value;
        const senha = document.getElementById('cadastro-senha').value;
        const confirmarSenha = document.getElementById('cadastro-confirmar-senha').value;
        const termos = document.getElementById('termos').checked;
        
        // Validar dados
        if (!termos) {
            alert('Você deve aceitar os termos e condições para se cadastrar.');
            return;
        }
        
        if (senha !== confirmarSenha) {
            alert('As senhas não coincidem. Tente novamente.');
            return;
        }
        
        // Verificar se o email já está cadastrado
        if (usuarios.some(u => u.email === email)) {
            alert('Este email já está cadastrado. Tente fazer login.');
            return;
        }
        
        // Criar novo usuário
        const novoUsuario = {
            id: usuarios.length + 1,
            nome,
            email,
            telefone,
            senha,
            dataCadastro: new Date().toISOString()
        };
        
        // Adicionar ao array de usuários
        usuarios.push(novoUsuario);
        
        // Salvar no localStorage
        salvarUsuarios();
        
        // Mostrar mensagem de sucesso
        alert('Cadastro realizado com sucesso! Faça login para continuar.');
        
        // Voltar para a aba de login
        document.getElementById('login-tab').click();
        
        // Preencher o campo de email no formulário de login
        document.getElementById('login-email').value = email;
    });
    
    // Evento para recuperar senha
    recuperarSenha.addEventListener('click', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        
        if (!email) {
            alert('Digite seu email no campo acima para recuperar sua senha.');
            return;
        }
        
        // Verificar se o email existe
        const usuario = usuarios.find(u => u.email === email);
        
        if (!usuario) {
            alert('Email não encontrado. Verifique se digitou corretamente.');
            return;
        }
        
        // Simulação de envio de email
        alert(`Uma nova senha foi enviada para ${email}. Verifique sua caixa de entrada.`);
    });
}

// Função para configurar o modal de termos
function configurarModal() {
    const modal = document.getElementById('modal-termos');
    const mostrarTermos = document.getElementById('mostrar-termos');
    const close = document.querySelector('.close');
    const aceitarTermos = document.getElementById('aceitar-termos');
    
    // Abrir modal ao clicar no link
    mostrarTermos.addEventListener('click', function(e) {
        e.preventDefault();
        modal.style.display = 'block';
    });
    
    // Fechar modal ao clicar no X
    close.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Fechar modal ao clicar fora dele
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Aceitar termos e fechar modal
    aceitarTermos.addEventListener('click', function() {
        document.getElementById('termos').checked = true;
        modal.style.display = 'none';
    });
}

// Função para autenticar usuário
function autenticarUsuario(email, senha) {
    // Procurar usuário pelo email e senha
    return usuarios.some(u => u.email === email && u.senha === senha);
}

// Função para salvar sessão do usuário
function salvarSessao(usuario) {
    // Criar objeto de sessão sem a senha
    const sessao = {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        telefone: usuario.telefone,
        logado: true,
        timestamp: new Date().toISOString()
    };
    
    // Salvar no localStorage
    localStorage.setItem('sessaoUsuario', JSON.stringify(sessao));
}

// Função para verificar se o usuário já está logado
function verificarSessao() {
    const sessao = localStorage.getItem('sessaoUsuario');
    
    if (sessao) {
        const sessaoObj = JSON.parse(sessao);
        
        // Verificar se a sessão ainda é válida (por exemplo, 7 dias)
        const dataAtual = new Date();
        const dataSessao = new Date(sessaoObj.timestamp);
        const diff = dataAtual - dataSessao;
        const diffDias = diff / (1000 * 60 * 60 * 24);
        
        if (diffDias < 7 && sessaoObj.logado) {
            // Se a sessão for válida, redirecionar para a página principal
            window.location.href = 'index.html';
        } else {
            // Se a sessão expirou, limpar sessão
            localStorage.removeItem('sessaoUsuario');
        }
    }
}

// Função para salvar usuários no localStorage
function salvarUsuarios() {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
}

// Função para carregar usuários do localStorage
function carregarUsuarios() {
    const dados = localStorage.getItem('usuarios');
    
    if (dados) {
        usuarios = JSON.parse(dados);
    }
} 