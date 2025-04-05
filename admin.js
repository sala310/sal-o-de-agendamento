// Verificar se o usuário é administrador
document.addEventListener('DOMContentLoaded', () => {
    const usuario = verificarAutenticacao();
    if (!usuario || !usuario.admin) {
        window.location.href = 'login.html';
        return;
    }

    // Carregar dados iniciais
    carregarEstatisticas();
    carregarAgendamentos();
    carregarClientes();
    carregarServicos();

    // Configurar eventos
    document.getElementById('btnLogout').addEventListener('click', () => {
        logout();
        window.location.href = 'login.html';
    });

    document.getElementById('btnNovoServico').addEventListener('click', mostrarFormularioServico);
});

// Funções para carregar dados
function carregarEstatisticas() {
    const agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    const hoje = new Date().toISOString().split('T')[0];
    
    // Agendamentos de hoje
    const agendamentosHoje = agendamentos.filter(a => a.data === hoje).length;
    document.getElementById('totalAgendamentos').textContent = agendamentosHoje;

    // Total de clientes
    const clientes = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const totalClientes = clientes.filter(c => !c.admin).length;
    document.getElementById('totalClientes').textContent = totalClientes;

    // Receita de hoje
    const receitaHoje = agendamentos
        .filter(a => a.data === hoje)
        .reduce((total, a) => total + a.valor, 0);
    document.getElementById('receitaHoje').textContent = `R$ ${receitaHoje.toFixed(2)}`;

    // Receita do mês
    const mesAtual = new Date().getMonth() + 1;
    const receitaMes = agendamentos
        .filter(a => new Date(a.data).getMonth() + 1 === mesAtual)
        .reduce((total, a) => total + a.valor, 0);
    document.getElementById('receitaMes').textContent = `R$ ${receitaMes.toFixed(2)}`;
}

function carregarAgendamentos() {
    const agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    const hoje = new Date().toISOString().split('T')[0];
    const agendamentosHoje = agendamentos.filter(a => a.data === hoje);
    
    const lista = document.getElementById('listaAgendamentos');
    lista.innerHTML = '';

    agendamentosHoje.forEach(agendamento => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div>
                <strong>${agendamento.cliente}</strong>
                <br>
                <small>${agendamento.servico} - ${agendamento.horario}</small>
            </div>
            <div>
                <button class="btn-admin btn-success" onclick="confirmarAgendamento(${agendamento.id})">Confirmar</button>
                <button class="btn-admin btn-danger" onclick="cancelarAgendamento(${agendamento.id})">Cancelar</button>
            </div>
        `;
        lista.appendChild(li);
    });
}

function carregarClientes() {
    const clientes = JSON.parse(localStorage.getItem('usuarios') || '[]')
        .filter(u => !u.admin)
        .sort((a, b) => new Date(b.dataCadastro) - new Date(a.dataCadastro));

    const lista = document.getElementById('listaClientes');
    lista.innerHTML = '';

    clientes.forEach(cliente => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div>
                <strong>${cliente.nome}</strong>
                <br>
                <small>${cliente.email}</small>
            </div>
            <div>
                <button class="btn-admin btn-primary" onclick="editarCliente(${cliente.id})">Editar</button>
            </div>
        `;
        lista.appendChild(li);
    });
}

function carregarServicos() {
    const servicos = JSON.parse(localStorage.getItem('servicos') || '[]');
    
    const lista = document.getElementById('listaServicos');
    lista.innerHTML = '';

    servicos.forEach(servico => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div>
                <strong>${servico.nome}</strong>
                <br>
                <small>R$ ${servico.preco.toFixed(2)} - ${servico.duracao}min</small>
            </div>
            <div>
                <button class="btn-admin btn-primary" onclick="editarServico(${servico.id})">Editar</button>
                <button class="btn-admin btn-danger" onclick="excluirServico(${servico.id})">Excluir</button>
            </div>
        `;
        lista.appendChild(li);
    });
}

// Funções para gerenciar agendamentos
function confirmarAgendamento(id) {
    const agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    const index = agendamentos.findIndex(a => a.id === id);
    
    if (index !== -1) {
        agendamentos[index].status = 'confirmado';
        localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
        carregarAgendamentos();
    }
}

function cancelarAgendamento(id) {
    const agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    const index = agendamentos.findIndex(a => a.id === id);
    
    if (index !== -1) {
        agendamentos[index].status = 'cancelado';
        localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
        carregarAgendamentos();
    }
}

// Funções para gerenciar serviços
function mostrarFormularioServico() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
    `;

    modal.innerHTML = `
        <div style="background: white; padding: 20px; border-radius: 8px; width: 400px;">
            <h3>Novo Serviço</h3>
            <form id="formServico">
                <div style="margin-bottom: 10px;">
                    <label>Nome do Serviço:</label>
                    <input type="text" name="nome" required style="width: 100%; padding: 8px;">
                </div>
                <div style="margin-bottom: 10px;">
                    <label>Preço:</label>
                    <input type="number" name="preco" step="0.01" required style="width: 100%; padding: 8px;">
                </div>
                <div style="margin-bottom: 10px;">
                    <label>Duração (minutos):</label>
                    <input type="number" name="duracao" required style="width: 100%; padding: 8px;">
                </div>
                <div style="margin-bottom: 10px;">
                    <label>Descrição:</label>
                    <textarea name="descricao" style="width: 100%; padding: 8px;"></textarea>
                </div>
                <button type="submit" class="btn-admin btn-primary">Salvar</button>
                <button type="button" class="btn-admin btn-danger" onclick="this.parentElement.parentElement.parentElement.remove()">Cancelar</button>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const novoServico = {
            id: Date.now(),
            nome: formData.get('nome'),
            preco: parseFloat(formData.get('preco')),
            duracao: parseInt(formData.get('duracao')),
            descricao: formData.get('descricao')
        };

        const servicos = JSON.parse(localStorage.getItem('servicos') || '[]');
        servicos.push(novoServico);
        localStorage.setItem('servicos', JSON.stringify(servicos));

        modal.remove();
        carregarServicos();
    });
}

function editarServico(id) {
    const servicos = JSON.parse(localStorage.getItem('servicos') || '[]');
    const servico = servicos.find(s => s.id === id);
    
    if (servico) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        modal.innerHTML = `
            <div style="background: white; padding: 20px; border-radius: 8px; width: 400px;">
                <h3>Editar Serviço</h3>
                <form id="formServico">
                    <div style="margin-bottom: 10px;">
                        <label>Nome do Serviço:</label>
                        <input type="text" name="nome" value="${servico.nome}" required style="width: 100%; padding: 8px;">
                    </div>
                    <div style="margin-bottom: 10px;">
                        <label>Preço:</label>
                        <input type="number" name="preco" value="${servico.preco}" step="0.01" required style="width: 100%; padding: 8px;">
                    </div>
                    <div style="margin-bottom: 10px;">
                        <label>Duração (minutos):</label>
                        <input type="number" name="duracao" value="${servico.duracao}" required style="width: 100%; padding: 8px;">
                    </div>
                    <div style="margin-bottom: 10px;">
                        <label>Descrição:</label>
                        <textarea name="descricao" style="width: 100%; padding: 8px;">${servico.descricao || ''}</textarea>
                    </div>
                    <button type="submit" class="btn-admin btn-primary">Salvar</button>
                    <button type="button" class="btn-admin btn-danger" onclick="this.parentElement.parentElement.parentElement.remove()">Cancelar</button>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('form').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            
            servico.nome = formData.get('nome');
            servico.preco = parseFloat(formData.get('preco'));
            servico.duracao = parseInt(formData.get('duracao'));
            servico.descricao = formData.get('descricao');

            localStorage.setItem('servicos', JSON.stringify(servicos));
            modal.remove();
            carregarServicos();
        });
    }
}

function excluirServico(id) {
    if (confirm('Tem certeza que deseja excluir este serviço?')) {
        const servicos = JSON.parse(localStorage.getItem('servicos') || '[]');
        const index = servicos.findIndex(s => s.id === id);
        
        if (index !== -1) {
            servicos.splice(index, 1);
            localStorage.setItem('servicos', JSON.stringify(servicos));
            carregarServicos();
        }
    }
}

// Função para editar cliente
function editarCliente(id) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuario = usuarios.find(u => u.id === id);
    
    if (usuario) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        modal.innerHTML = `
            <div style="background: white; padding: 20px; border-radius: 8px; width: 400px;">
                <h3>Editar Cliente</h3>
                <form id="formCliente">
                    <div style="margin-bottom: 10px;">
                        <label>Nome:</label>
                        <input type="text" name="nome" value="${usuario.nome}" required style="width: 100%; padding: 8px;">
                    </div>
                    <div style="margin-bottom: 10px;">
                        <label>Email:</label>
                        <input type="email" name="email" value="${usuario.email}" required style="width: 100%; padding: 8px;">
                    </div>
                    <div style="margin-bottom: 10px;">
                        <label>Telefone:</label>
                        <input type="tel" name="telefone" value="${usuario.telefone || ''}" style="width: 100%; padding: 8px;">
                    </div>
                    <button type="submit" class="btn-admin btn-primary">Salvar</button>
                    <button type="button" class="btn-admin btn-danger" onclick="this.parentElement.parentElement.parentElement.remove()">Cancelar</button>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('form').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            
            usuario.nome = formData.get('nome');
            usuario.email = formData.get('email');
            usuario.telefone = formData.get('telefone');

            localStorage.setItem('usuarios', JSON.stringify(usuarios));
            modal.remove();
            carregarClientes();
        });
    }
} 